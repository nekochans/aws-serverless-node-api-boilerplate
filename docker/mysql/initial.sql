-- 'serverless_test' というデータベースを作成
-- 'serverless_test_user' というユーザー名のユーザーを作成
-- データベース 'serverless_test' への権限を付与
CREATE DATABASE IF NOT EXISTS serverless_test CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
GRANT ALL ON serverless_test.* TO `serverless_test_user`@`%` IDENTIFIED BY 'Serverless_Test_User|8888';
GRANT ALL ON *.* TO `serverless_test_user`@`%` IDENTIFIED BY 'Serverless_Test_User|8888';
