SET NOCOUNT ON;
DECLARE @tableIndex INT = 1;
DECLARE @tableName NVARCHAR(255);

DECLARE @tables TABLE (ID INT IDENTITY(1,1), TableName NVARCHAR(255));

INSERT INTO @tables (TableName)
VALUES ('Options'), ('Questions'), ('User_Assigned_Courses'), 
       ('Courses'), ('Learning_Paths'), ('User_Assessment_Attempts');

WHILE @tableIndex <= (SELECT COUNT(*) FROM @tables)
BEGIN
    SELECT @tableName = TableName FROM @tables WHERE ID = @tableIndex;

    -- Delete records
    EXEC('DELETE FROM ' + @tableName);

    -- Reset primary key identity
    EXEC('DBCC CHECKIDENT (''' + @tableName + ''', RESEED, 0) WITH NO_INFOMSGS');

	PRINT(@tableName + ' cleared.');

    SET @tableIndex = @tableIndex + 1;
END;