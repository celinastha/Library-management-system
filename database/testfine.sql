-- 1. FIX THE SCHEMA MISMATCH
-- FINES.Loan_id must match the size of BOOK_LOANS.Loan_id (36)
ALTER TABLE FINES MODIFY Loan_id VARCHAR(36);

-- 2. ENSURE DATA EXISTS (So the insert doesn't fail)
-- Create a dummy book and the borrower if they don't exist
INSERT IGNORE INTO BOOK (Isbn, Title) VALUES ('999-TEST-ISBN', 'The Late Book');
INSERT IGNORE INTO BORROWER (Card_id, Ssn, Bname, Address, Phone) 
VALUES ('ID000001', '999-00-9999', 'Test Borrower', '123 Test Ln', '555-0100');

-- 3. CREATE A LATE LOAN
-- We manually specify a Loan_id so we can reference it in the next step.
-- This loan was due 10 days ago.
INSERT INTO BOOK_LOANS (Loan_id, Isbn, Card_id, Date_out, Due_date, Date_in)
VALUES 
(
    'loan-445-test-uuid',   -- The specific Loan ID we will fine
    '999-TEST-ISBN',        -- Book ISBN
    'ID000001',             -- Borrower Card ID
    DATE_SUB(CURDATE(), INTERVAL 24 DAY), -- Checked out 24 days ago
    DATE_SUB(CURDATE(), INTERVAL 10 DAY), -- Due 10 days ago (LATE!)
    NULL                                  -- Still checked out
);

-- 4. INSERT THE FINE MANUALLY
-- Calculation: 10 days late * $0.25 = $2.50
INSERT INTO FINES (Loan_id, Fine_amt, Paid)
VALUES ('loan-445-test-uuid', 2.50, 0);

-- Check the result
SELECT * FROM FINES;