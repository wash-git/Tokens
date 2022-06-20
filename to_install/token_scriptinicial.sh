#!/bin/bash
#
#								OBS: as tabelas deste módulo devem começar obrigatoriamente com o prefixo to_
#									
TOROOT_UID=0                       # root ID
TOPINSTTOKEN="to_install"          # nome da pasta de instalação deste módulo
TOPINSTSUPER="../su_install"       # nome da pasta de instalação da Superinterface
TOACONFTOKEN="token_config.cnf"    # arquivo de configuração do módulo
TOACONFSUPER="super_config.cnf"    # arquivo de configuração da Superinterface
declare -A arv                     # variável arv ('árvore hierárquica') guardará informações da árvore hierárquica necessárias
#                                  para geração dos códigos PHP das telas (códigos PHP de geração automática por este script)
#
#                                                                        :           :           :
#                                                                       3           3           3
#                                                                      2           2           2
#                                                                     1           1           1
#                                                                    0           0           0
#                           (0,0,0)     (0,1,0)     (0,2,0)     (0,3,_)     (0,4,_)     (0,5,_)     (0,6,0)
#                           (1,0,0)     (1,1,0)     (1,2,0)     (1,3,_)     (1,4,_)     (1,5,_)     (1,6,0)
#                           (2,0,0)     (2,1,0)     (2,2,0)     (2,3,_)     (1,5,_)     (2,5,_)     (2,6,0)
#                              :           :           :           :           :           :           :
#                           (n,0,0)     (n,1,0)     (n,2,0)     (n,3,_)     (n,5,_)     (n,5,_)     (n,6,0)
#                             \ /         \ /         \ /         \ /         \ /         \ /         \ /
#                              |           |           |           |           |           |           +-quantidade_opções
#                              |           |           |           |           |           +-grupo_opção
#                              |           |           |           |           +-nomes
#                              |           |           |           +-opções
#                              |           |           +-arquivo_filtro
#                              |           +-descrição ^           ^           ^           ^           ^
#                              +-nro nó    ^           |           |           |           |           |
#                              (coluna 0)  (coluna 1)  (coluna 2)  (coluna 3)  (coluna 4)  (coluna 5)  (coluna 6)
#								
#                             coluna-0: guardará o número do nó (=id_chave_classe da tabela nested_classes)
#                             coluna-1: guardará o nome da descrição do nó
#                             coluna-2: guardará o nome do arquivo a ser gerado, filtrado (minuscula, sem espaços,...)
#                             coluna-3: guardará o número dos nós de cada opção disponível ao internauta (dentro de cada classe)
#                             coluna-4: guardará os nomes das opções
#                             coluna-5: guardará o grupo de opções a que pertence cada opção
#                             coluna-6: guardará a quantidade de opções disponíveis ao internauta
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                                              MENSAGENS DO SCRIPT                                          |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
#
MErr01="Erro! Não é permitido executar este script como usuário root"
MErr02="Erro! Para instalar este módulo de tokens é obrigatório estar na pasta '$TOPINSTTOKEN'"
MErr03="Erro! Não foi encontrado o arquivo de configuração"
MErr04="Erro! Não foi possível preparar as pastas necessárias"
MErr05="Erro! Não foi possível criar a pasta de 'logs'"
MErr06="Interrompendo a execução do script"
MErr07="Erro! Não foi encontrado o arquivo com comandos SQL para criação das tabelas"
MErr08="Erro! Problemas na geração do arquivo de configuração do script PHP"
MErr09="Erro! Superinterface possivelmente ainda não foi instalada. É necessário ter a Superinterface instalada para utilizar este módulo"
MErr10="Erro! Não foi encontrado a pasta de arquivos javascript deste módulo"
MErr11="Erro! Não foi possível se conectar com o banco de dados"
MErr12="Erro! Não foi possível limpar as tabelas do banco de dados"
MErr13="Erro! Não foi possível criar tabelas no banco de dados"
MErr14="Erro! Não foi possível inserir na base de dados as informações da árvore hierárquica (do arquivo CSV)"
MErr15="Erro! Não foi encontrado a planilha para alimentação da tabela de classes de tokes"
MErr16="Erro! Não foi possível identificar os nós para os quais serão gerados códigos PHP automáricos relativos as telas"
MErr17="Erro! Algum problema na identificação das opções que estariam disponíveis ao internauta"
MErr18="Erro! Não foi encontrado a pasta de arquivos PHP deste módulo"
MErr19="Erro! Arquivo de configuração da Superinterface não encontrado"
MErr20="Erro! Não foi encontrado a pasta de arquivos CSS deste módulo"
MErr21="Erro! Não foi encontrado a pasta de arquivos de figuras deste módulo"
MErr22="Erro! Não foi possível criar a pasta de administração do PHP"
#
MInfo01="Sucesso! Criada pasta de arquivos de logs"
MInfo02="Sucesso! Conexão com o banco de dados foi realizada corretamente"
MInfo03="Sucesso! Possíveis tabelas remanescentes no banco de dados foram eliminadas"
MInfo04="Sucesso! Tabelas do banco de dados (re)criadas corretamente"
MInfo05="Sucesso! Tabela de classes de tokens alimentada (a partir do arquivo CSV)"
MInfo06="Bem vind@ ao script de instalação do Módulo de Tokens em:   "
MInfo07="Data:"
MInfo08="Iniciando a instalação"
MInfo09="Total de registros de Classes PAI= "
MInfo10="Identificando os nós para os quais serão gerados arquivos PHP: "
MInfo11="Resumo da Instalação, iniciando pelos parâmetros do ambiente:"
MInfo12="Quantidade de tabelas geradas= "
MInfo13="Quantidade de registros na tabela "
MInfo14="Parabéns!!!   A instalação do Módulo de Tokens foi um sucesso!"
MInfo15="Aproveite e dê uma olhadinha no log da instalação que está no arquivo: "
MInfo16="Aproveite e dê uma olhadinha nos códigos PHP gerados automaticamente na pasta: "
MInfo17="Script terminado em"
MInfo18="Quantidade de arquivos PHP gerados automaticamente= "
MInfo19="Gerando os arquivos PHP. Aguarde...."
#
FInfor=0    # saída normal: new line ao final, sem tratamento de cor, pontinhos no início (.....)
FInfo1=1    # saída normal: new line ao final, sem tratamento de cor e sem pontinhos no início
FInfo2=2    # saída sem new line ao final, sem tratamento de cor
FInfo3=3    # saída normal: new line ao final, sem tratamento de cor, espaços em branco no inicio (     )
FInfo4=4    # saída sem new line ao final, sem tratamento de cor, espaços em branco no início (     )
FInfo5=5	# saída sem new line (nem no início nem no final), sem trat. cores, sem espaços no início ou no final
FSucss=6    # saída para indicação de sucesso: new line ao final da mensagem. na cor azul. No final, muda para cor branca
FSucs2=7    # saída para indicação de sucesso: new line antes e depois da mensagem, cor azul. No final, muda para cor branca
FSucs3=8    # saída para indicação de sucesso: sem new line ao final, cor azul.
FSucs4=9    # saída para indicação de sucesso: sem pontinhos no início, cor azul, e new line ao final.
FInsuc=10   # saída para indicação de erro, na cor vermelha
FInsu1=11   # saída para indicação de erro, na cor vermelha (apenas no screen, não enviado para arquivo de log)
FInsu2=12   # saída para indicação de erro, sem line feed ao final, cor vermelha
FInsu3=13   # saída para indicação de erro, com line feed ao final, cor vermelha, ao final volta cor default
#
MCor01="\e[97m"     # cor default (branca), quando for enviar mensagens
MCor02="\e[33m"     # cor amarela, quando for enviar mensagens
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                             FUNÇÃO PARA ENVIO DE MENSAGENS DE LOGS                                        |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
function fMens () {
	case $1 in
		$FInfor)
			echo -e ".....$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInfo1)
			echo -e "$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInfo2)
			echo -n ".....$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInfo3)
			echo -e "     $2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInfo4)
			echo -n "     $2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInfo5)
			echo -n "$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FSucss)
			echo -e "\e[34m.....$2\e[97m" | tee -aa "$TOPLOG"/"$TOALOG"
			;;
		$FSucs2)
			echo -e "\n\e[34m.....$2\e[97m" | tee -aa "$TOPLOG"/"$TOALOG"
			;;
		$FSucs3)                                                                # sem line feed ao final, cor azul
			echo -ne "\e[34m.....$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FSucs4)                                                                # com line feed ao final, cor azul, ao final volta cor default
			echo -e "\e[34m$2\e[97m"        | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInsuc)
			echo -e  "\n\e[31m.....$2"      | tee -a "$TOPLOG"/"$TOALOG"
			echo -e ".....$MErr06\e[97m" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInsu1)
			echo -e  "\n\e[31m.....$2"
			echo -e ".....$MErr06\e[97m"
			;;
		$FInsu2)                                                                # sem line feed ao final, cor vermelha
			echo -ne "\e[31m.....$2" | tee -a "$TOPLOG"/"$TOALOG"
			;;
		$FInsu3)                                # com line feed ao final, cor vermelha, ao final volta cor default
			echo -e "\e[31m$2\e[97m"  | tee -a "$TOPLOG"/"$TOALOG"
			;;
		*)
			echo "\e[31m.....OOOooops!\e[97m" | tee -a "$TOPLOG"/"$TOALOG"
			echo $1 | tee -a "$TOPLOG"/"$TOALOG"
			exit
			;;
esac
}
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                                              FUNÇÃO PARA VERIFICAÇÃO DO AMBIENTE                          |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
#
function tofInit () {
	#                                               		verificar se é usuário root
	if [ "$EUID" -eq $TOROOT_UID ];  then 
		fMens "$FInsu1" "$MErr01"
		exit
	fi
	#														verificar se pasta corrente é a de instalação
	if [ "${PWD##*/}" != "$TOPINSTTOKEN" ]; then
		fMens "$FInsu1" "$MErr02"
		exit
	fi
	#														verificar se arquivo de configuração do módulo está disponível
	if [ ! -f $TOACONFTOKEN ]; then
		fMens "$FInsu1" "$MErr03"
		exit
	fi
	#														verificar se a Superinterface está instalada
	if [ ! -d $TOPINSTSUPER ]; then
		fMens "$FInsu1"	"$MErr09"
		exit
	fi
	#														verificar se arquivo de configuração da Superinterface está disponível
	if [ ! -f $TOPINSTSUPER/$TOACONFSUPER ]; then
		fMens "$FInsu1"	"$MErr19"
		exit
	fi
	source	$TOPINSTSUPER/$TOACONFSUPER						# inserir arquivo de configuração da Superinterface
	source  $TOACONFTOKEN									# inserir arquivo de configuração deste módulo
	#														definir permissões iniciais temporárias de acesso a pastas e arquivos
	find ../to_* -type d -exec chmod $TOCHMOD750 {} \;
	find ../to_* -type f -exec chmod $TOCHMOD640 {} \;
	chmod $TOCHMOD500 ./*.sh								# definir permissão para arquivos de scripts shell da pasta de instalação
	#														limpar pastas               
	rm -rf {$TOPLOG,$TOPADMIN}  2>/dev/null
	if [ $? -ne 0 ]; then
		fMens "$FInsu1" "$MErr04"
		exit
	fi
	#														criar pasta de logs
	mkdir $TOPLOG
	if [ $? -ne 0 ]; then
		fMens "$FInsu1" "$MErr05"
		exit
	fi
	fMens "$FInfo1" "$MCor02"                   # saída na cor amarela
	fMens "$FInfo2" "$MInfo06"                  # enviar mensagem de boas vindas
	fMens "$FInfo1" "$0"						# $0
	fMens "$FInfor" "$MInfo07:  $(date '+%d-%m-%Y as  %H:%M:%S') --- $MInfo08"
	fMens "$FInfo1" "$MCor01"
	fMens "$FSucss" "$MInfo01"						# sucesso na criação de pasta de logs
	#												verificar existência arquivo com comandos SQL criação de tabelas
	if [ ! -f $TOPINFO/$TOACRIATABELAS ]; then
		fMens "$FInsuc" "$MErr07"
		exit
	fi
	#										criar pasta de trabalho
	#rm -rf $TOPWORK 2>/dev/null
	#mkdir $TOPWORK
	#if [ $? -ne 0 ]; then
	#	fMens "$FInsuc" "$MErr08"
	#	exit
	#fi
	#										verificar existência de pasta de javascript deste módulo
	if [ ! -d $TOPJS ]; then
		fMens "$FInsuc" "$MErr10"
		exit
	fi
	#										verificar existência de pasta de arquivos de PHP's deste módulo
	if [ ! -d $TOPPHP ]; then
		fMens "$FInsuc" "$MErr18"
		exit
	fi
	#										verificar existência de pasta de CSS deste módulo
	if [ ! -d $TOPCSS ]; then
		fMens "$FInsuc" "$MErr20"
		exit
	fi
	#										verificar existência de pasta de figuras deste módulo
	if [ ! -d $TOPIMG ]; then
		fMens "$FInsuc" "$MErr21"
		exit
	fi
	#										criar pasta para conter arquivo de configuração do PHP
	mkdir $TOPADMIN
	if [ $? -ne 0 ]; then
		fMens "$FInsuc" "$MErr22"
		exit
	fi	
	# --- --- ---
	#										testar conexão com o banco de dados
	mysql -u $CPBASEUSER -b $CPBASE -p$CPBASEPASSW -e "quit" 2>/dev/null
	if [ $? -ne 0 ]; then
		fMens "$FInsuc" "$MErr11"
		exit
	else
		fMens "$FSucss" "$MInfo02"
	fi
}
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       FUNÇÃO DE CRIAÇÃO DAS TABELAS                                                       |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
function tofCriaTabelas () {
	#									apagar possíveis tabelas e verificar se base de dados está limpa
	TABLES=$(mysql -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e 'show tables' | awk '{ print $1}' | grep -v '^Tables' | grep to_*);
	for t in ${TABLES[*]}
	do
		mysql -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "SET FOREIGN_KEY_CHECKS = 0 ; drop table $t"
		if [ $? -ne 0 ]; then
			fMens "$FInsuc" "$MErr12"
			exit
		fi
	done
	fMens "$FSucss" "$MInfo03"
	mysql  -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "SET FOREIGN_KEY_CHECKS = 1"
	if [ $? -ne 0 ]; then
		fMens "$FInsuc" "$MErr13"
		exit
	fi
	#									criar as tabelas
	mysql -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE < "$TOPINFO"/"$TOACRIATABELAS"
	if [ $? -eq 0 ]; then
		fMens "$FSucss" "$MInfo04"
	else
		fMens "$FInsuc" "$MErr13"
		exit
	fi

}
#
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       FUNÇÃO DE INSERTS NA TABELA DE CLASSES                                              |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
function tofInsertClass () {
	if [ -f "$TOPINFO/$TOAARVORE" ]; then
 		sql="LOAD DATA LOCAL INFILE '$TOPINFO/$TOAARVORE' INTO TABLE $TOTABCLASSES  FIELDS TERMINATED by ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES"
 		mysql -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "$sql"
 		if [ $? -ne 0 ];then
			fMens	"$FInsuc"	"$MErr14"
 			exit
 		else
			fMens	"$FSucss"	"$MInfo05"	
 		fi
 	else
		fMens	"$FInsuc"	"$MErr15"
		exit
	fi
}
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       FUNÇÃO PARA CRIAR ARQUIVO DE CONFIGURAÇÃO PARA O SCRIPT PHP                         |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
tofCriaConfPhp () {
	echo -e "<?php\n\$banco = \"$CPBASE\";\n\$username = \"$CPBASEUSER\";" > $TOPADMIN/$TOACONFPHP
	echo -e "\$pass = \"$CPBASEPASSW\";"        >> $TOPADMIN/$TOACONFPHP
	echo -e "\$pastalogs = \"$TOPLOG\";"        >> $TOPADMIN/$TOACONFPHP
	echo -e "\$pastaadmin = \"$TOPADMIN\";"     >> $TOPADMIN/$TOACONFPHP
	echo -e "\$arqlogs   = \"$TOALOG\";"        >> $TOPADMIN/$TOACONFPHP
	echo -e "?>\n" >> $TOPADMIN/$TOACONFPHP
	#                                           verificar criação do arquivo de configuração para o PHP
	if [ $? -ne 0 ]; then
		fMens "$FInsuc" "$MErr08"
		exit
	fi
}
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       FUNÇÃO PARA CONFIGURAR AUTORIDADES DE PASTAS E ARQUIVOS                             |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
tofSeguranca () {
	#										definir permissões de acesso para pastas e arquivos
	find ../to_* -type d -exec chmod $TOCHMOD750 {} \;
	find ../to_* -type f -exec chmod $TOCHMOD640 {} \;
	chmod $TOCHMOD400 $TOACONFTOKEN			# definir permissão para o arquivo de configuração do módulo
	chmod $TOCHMOD400 $TOPADMIN/$TOACONFPHP	# definir permissão para o arquivo de configuração utilizado pelos scripts PHP
	chmod $TOCHMOD500 ./*.sh				# definir permissão para arquivos de scripts shell da pasta de instalação
}



#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       FUNÇÃO PARA INFORMAR O RESUMO DA INSTALAÇÃO                                         |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
tofResumo () {
	fMens "$FInfor" "$MInfo11"
	#fMens "$FInfo3" "$(printenv SHELL)"
	fMens "$FInfo3" "$($SHELL --version | head -1)"
	fMens "$FInfo3" "$(/usr/bin/lsb_release -ds)"
	fMens "$FInfo3" "$(printenv LANG)"
	fMens "$FInfo3" "$(php -v | head -1)"
	fMens "$FInfo3" "$(mysql  -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e \"select @@version\" | head -1)"
	fMens "$FInfo3" "$(/usr/bin/id -un)"
	fMens "$FInfo2" "$MInfo12"
	#fMens "$FInfo1" "$(mysql -N -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '$CPBASE'")"
	TABLES=$(mysql -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e 'show tables' | awk '{ print $1}' | grep -v '^Tables' | grep to_*);
	aa=( $TABLES )
	#echo ${#aa[@]}
	fMens	"$FInfo1"	"${#aa[@]}" 
	for arq in $TABLES
	do
		fMens "$FInfo4" "$MInfo13 $arq= "
		fMens "$FInfo1" "$(mysql -N -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "SELECT count(*) FROM $arq") "
	done
	totalpai=$(mysql -N -u $CPBASEUSER -p$CPBASEPASSW -b $CPBASE -e "SELECT count(*) FROM $TOTABCLASSES WHERE tela<>0")
	fMens	"$FInfor"	"$MInfo09$totalpai"
	fMens   "$FSucs2"   "$MInfo14"
	fMens	"$FInfo2"	"$MInfo15" ; fMens	"$FInfo1"	"$TOPLOG/$TOALOG"
	fMens	"$FInfo2"	"$MInfo16" ; fMens	"$FInfo1"	"$TOPAUTOPHP"
	fMens	"$FInfor"	"$MInfo17:  $(date '+%d-%m-%Y as  %H:%M:%S')"
}
#
# --------------------------------------------------------------------------------------------------------------------------+
#                                                                                                                           |
#                                       CORPO PRINCIPAL DO SCRIPT                                                           |
#                                                                                                                           |
# --------------------------------------------------------------------------------------------------------------------------+
# 
tofInit									# inicia criação econsistência de pastas (e arquivos)
tofCriaTabelas							# cria as tabelas
tofInsertClass							# insere informações na tabela de classes
tofCriaConfPhp							# cria arquivo de configuração para o PHP
tofSeguranca							# definir autoridade de acesso a pastas e arquivos
#
#
tofResumo
exit 0
