-- Book loans procedures
DROP PROCEDURE IF EXISTS checkout_book;

DELIMITER $$
CREATE PROCEDURE checkout_book(IN p_isbn VARCHAR(20), IN p_card_id VARCHAR(20))
BEGIN
    DECLARE active_loans INT;
    DECLARE unpaid_fines INT;
    DECLARE is_out INT;

    START TRANSACTION;
    
    -- Check borrower total loans - borrower must have fewer than 3 active loans
    SELECT COUNT(*) INTO active_loans
    FROM BOOK_LOANS
    WHERE Card_id = p_card_id AND Date_in IS NULL;
    IF active_loans >= 3 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Borrower already has 3 active loans.';
    END IF;

    -- Check unpaid fines - borrower must have no unpaid fines
    SELECT COUNT(*) INTO unpaid_fines
    FROM FINES f
    JOIN BOOK_LOANS bl ON bl.Loan_id = f.Loan_id
    WHERE bl.Card_id = p_card_id AND f.Paid = 0;
    IF unpaid_fines > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Borrower has unpaid fines.';
    END IF;

    -- Check if book is checked out - book must not be checked out
    SELECT COUNT(*) INTO is_out
    FROM BOOK_LOANS
    WHERE Isbn = p_isbn AND Date_in IS NULL;
    IF is_out > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book is already checked out.';
    END IF;

    -- Insert new loan with due date +14 days
    INSERT INTO BOOK_LOANS (Loan_id, Isbn, Card_id, Date_out, Due_date, Date_in)
    VALUES (UUID(), p_isbn, p_card_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL);

    COMMIT;
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE search_loans(IN p_query VARCHAR(255))
BEGIN
    SELECT 
		bl.Loan_id, bl.Card_id, bl.Isbn, bl.Date_out, bl.Due_date, bl.Date_in,
		b.Title,
		br.Bname AS BorrowerName
    FROM BOOK_LOANS bl
    JOIN BOOK b ON b.Isbn = bl.Isbn
    JOIN BORROWER br ON br.Card_id = bl.Card_id
    WHERE (LOWER(bl.Isbn) LIKE CONCAT('%', LOWER(p_query), '%')
        OR LOWER(bl.Card_id) LIKE CONCAT('%', LOWER(p_query), '%')
        OR LOWER(br.Bname) LIKE CONCAT('%', LOWER(p_query), '%'))
		AND bl.Date_in IS NULL
    ORDER BY bl.Due_date;
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE checkin_books(IN p_loan_id1 VARCHAR(20), IN p_loan_id2 VARCHAR(20), IN p_loan_id3 VARCHAR(20))
BEGIN
    -- Loan 1
    IF p_loan_id1 IS NOT NULL THEN
        UPDATE BOOK_LOANS
        SET Date_in = CURDATE()
        WHERE Loan_id = p_loan_id1
          AND Date_in IS NULL;
    END IF;

    -- Loan 2
    IF p_loan_id2 IS NOT NULL THEN
        UPDATE BOOK_LOANS
        SET Date_in = CURDATE()
        WHERE Loan_id = p_loan_id2
          AND Date_in IS NULL;
    END IF;

    -- Loan 3
    IF p_loan_id3 IS NOT NULL THEN
        UPDATE BOOK_LOANS
        SET Date_in = CURDATE()
        WHERE Loan_id = p_loan_id3
          AND Date_in IS NULL;
    END IF;
END$$
DELIMITER ;




-- Example calls
-- CALL checkout_book('1557866031', 'ID000994', 'LN000123');
-- CALL search_loans('will'); 
-- CALL checkin_books('LN000123',NULL,NULL);   -- one checkin
-- CALL checkin_books('LN000123','LN000124',NULL); -- two checkin
-- CALL checkin_books('LN000123','LN000124','LN000125'); -- three checkin