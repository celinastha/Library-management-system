-- Borrower management procedures

DELIMITER $$
CREATE PROCEDURE add_borrower(IN p_ssn VARCHAR(15), IN p_name VARCHAR(255), IN p_address VARCHAR(255), IN p_phone VARCHAR(25))
BEGIN
    DECLARE next_id VARCHAR(20);
	DECLARE max_num INT;

    START TRANSACTION;

    -- SSN must be unique check
    IF EXISTS (SELECT 1 FROM BORROWER WHERE Ssn = p_ssn) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Borrower with this SSN already exists.';
    END IF;
	
    
    -- Highest existing Card_id
    SELECT COALESCE(MAX(CAST(SUBSTRING(Card_id, 3) AS UNSIGNED)), 0)
    INTO max_num
    FROM BORROWER;


    -- Generate next Card_id
    SET next_id = CONCAT('ID', LPAD(max_num + 1, 6, '0'));


    -- Insert borrower
    INSERT INTO BORROWER (Card_id, Ssn, Bname, Address, Phone)
    VALUES (next_id, p_ssn, p_name, p_address, p_phone);

    COMMIT;
END$$
DELIMITER ;




-- Example calls
CALL add_borrower('345-67-8888', 'Adam Smith', '257 Main St, Dallas, TX', '(214) 678-9999'); 
CALL add_borrower('567-89-1011', 'Sam Johnson', '328 Main St, Dallas, TX', '(214) 789-1234');