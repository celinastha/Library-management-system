-- Fines procedures


DELIMITER $$
CREATE PROCEDURE refresh_fines()
BEGIN
    -- Returned late books
    INSERT INTO FINES (Loan_id, Fine_amt, Paid)
    SELECT bl.Loan_id, ROUND(DATEDIFF(bl.Date_in, bl.Due_date) * 0.25, 2), 0
    FROM BOOK_LOANS bl
    WHERE bl.Date_in IS NOT NULL AND DATEDIFF(bl.Date_in, bl.Due_date) > 0
    ON DUPLICATE KEY UPDATE Fine_amt = IF(Paid = 0, VALUES(Fine_amt), Fine_amt);

    -- Still out late books
    INSERT INTO FINES (Loan_id, Fine_amt, Paid)
    SELECT bl.Loan_id, ROUND(DATEDIFF(CURDATE(), bl.Due_date) * 0.25, 2), 0
    FROM BOOK_LOANS bl
    WHERE bl.Date_in IS NULL AND DATEDIFF(CURDATE(), bl.Due_date) > 0
    ON DUPLICATE KEY UPDATE Fine_amt = IF(Paid = 0, VALUES(Fine_amt), Fine_amt);
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE pay_fines(IN p_card_id VARCHAR(20))
BEGIN
    DECLARE still_out_unpaid INT;

    START TRANSACTION;

    -- Cannot pay fines if books are still out
    SELECT COUNT(*) INTO still_out_unpaid
    FROM FINES f
    JOIN BOOK_LOANS bl ON bl.Loan_id = f.Loan_id
    WHERE bl.Card_id = p_card_id AND f.Paid = 0 AND bl.Date_in IS NULL;

    IF still_out_unpaid > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot pay fines while books are still out.';
    END IF;

    -- Mark all unpaid fines as paid
    UPDATE FINES f
    JOIN BOOK_LOANS bl ON bl.Loan_id = f.Loan_id
    SET f.Paid = 1
    WHERE bl.Card_id = p_card_id AND f.Paid = 0;

    COMMIT;
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE display_fines(
	IN p_card_id VARCHAR (20), 
    IN p_include_paid_fines BOOLEAN
)
BEGIN
	-- displays paid fines 
    IF p_include_paid_fines THEN
        SELECT bl.Card_id, SUM(f.Fine_amt) AS Total_Fines
        FROM FINES f
        JOIN BOOK_LOANS bl ON bl.Loan_id = f.Loan_id
        GROUP BY bl.Card_id;
    ELSE
    -- displays unpaid fines 
        SELECT bl.Card_id, SUM(f.Fine_amt) AS Total_Fines
        FROM FINES f
        JOIN BOOK_LOANS bl ON bl.Loan_id = f.Loan_id
        WHERE f.Paid = 0
        GROUP BY bl.Card_id;
    END IF;
END$$
DELIMITER ;




-- Example calls
CALL refresh_fines(); 
CALL pay_fines('ID000994'); 
CALL display_fines_for_borrower('ID000994', FALSE); 