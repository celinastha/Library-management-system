-- Borrower management procedures


DELIMITER $$
CREATE PROCEDURE add_borrower(IN p_ssn VARCHAR(15), IN p_name VARCHAR(255), IN p_address VARCHAR(255), IN p_phone VARCHAR(25))
BEGIN
    DECLARE next_id VARCHAR(20);

    START TRANSACTION;

    -- SSN must be unique check
    IF EXISTS (SELECT 1 FROM BORROWER WHERE Ssn = p_ssn) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Borrower with this SSN already exists.';
    END IF;

    -- Generate next Card_id using sequence table
    INSERT INTO CARD_SEQ VALUES ();
    SET next_id = CONCAT('ID', LPAD(LAST_INSERT_ID(), 6, '0'));

    -- Insert borrower
    INSERT INTO BORROWER (Card_id, Ssn, Bname, Address, Phone)
    VALUES (next_id, p_ssn, p_name, p_address, p_phone);

    COMMIT;
END$$
DELIMITER ;




-- Example calls
CALL add_borrower('123-45-6789', 'Alice Smith', '123 Main St, Dallas, TX', '(214) 555-1234'); 
CALL add_borrower('234-56-7891', 'Lacy Johnson', '456 Main St, Dallas, TX', '(214) 666-1234');