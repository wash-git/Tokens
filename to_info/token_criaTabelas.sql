CREATE TABLE to_tokens (id_chave_token INT AUTO_INCREMENT PRIMARY KEY,token_name VARCHAR(127),id_classe INT NOT NULL);
CREATE TABLE to_nested_classes (id_chave_classe int AUTO_INCREMENT not null, nome_classe VARCHAR(127) not null,lft INT not null,rgt INT not null, primary key(id_chave_classe));

ALTER TABLE to_nested_classes 
	ADD opcao tinyint DEFAULT FALSE after rgt,
	ADD tela   tinyint DEFAULT FALSE after opcao,
	ADD grupo int after tela,
	ADD descricao VARCHAR(64) DEFAULT " " after grupo;

