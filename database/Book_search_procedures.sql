-- Book search and availability procedures 


DELIMITER $$
CREATE PROCEDURE search_books(IN p_query VARCHAR(255))
BEGIN
	SELECT
	  b.Isbn AS ISBN,
	  b.Title AS Title,
	  GROUP_CONCAT(DISTINCT a.Name ORDER BY a.Name SEPARATOR ', ') AS Authors,
	  CASE
		WHEN EXISTS (
		  SELECT 1
		  FROM BOOK_LOANS bl
		  WHERE bl.Isbn = b.Isbn
			AND bl.Date_in IS NULL
		) THEN 'OUT'
		ELSE 'IN'
	  END AS Status
	FROM BOOK b
	JOIN BOOK_AUTHORS ba ON b.Isbn = ba.Isbn
	JOIN AUTHORS a ON a.Author_id = ba.Author_id
	WHERE LOWER(b.Isbn)  LIKE CONCAT('%', LOWER(p_query), '%')
	  OR LOWER(b.Title) LIKE CONCAT('%', LOWER(p_query), '%')
	  OR LOWER(a.Name)  LIKE CONCAT('%', LOWER(p_query), '%')
	GROUP BY b.Isbn, b.Title
	ORDER BY b.Title;
END$$
DELIMITER ;




-- Example calls
CALL search_books('will');
CALL search_books('0002005395');