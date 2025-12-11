DELIMITER $$

CREATE PROCEDURE GetBorrowerLoans(
    IN borrower_ssn VARCHAR(15),
    IN borrower_card VARCHAR(20)
)
BEGIN
    IF borrower_ssn IS NOT NULL AND borrower_ssn <> '' THEN
        SELECT bl.Loan_id,
               bl.Isbn,
               b.Title,
               bl.Date_out,
               bl.Due_date,
               bl.Date_in
        FROM BOOK_LOANS bl
        JOIN BOOK b ON bl.Isbn = b.Isbn
        JOIN BORROWER br ON bl.Card_id = br.Card_id
        WHERE br.Ssn = borrower_ssn;

    ELSEIF borrower_card IS NOT NULL AND borrower_card <> '' THEN
        SELECT bl.Loan_id,
               bl.Isbn,
               b.Title,
               bl.Date_out,
               bl.Due_date,
               bl.Date_in
        FROM BOOK_LOANS bl
        JOIN BOOK b ON bl.Isbn = b.Isbn
        WHERE bl.Card_id = borrower_card;
    END IF;
END$$

DELIMITER ;

CALL GetBorrowerLoans('647-49-5762', NULL);