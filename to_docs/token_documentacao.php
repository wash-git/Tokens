<!DOCTYPE html>
<html lang='pt-br'>
<head>
<title>Referência Técnica do Módulo de Tokens da Superinterface</title>
<meta charset="utf-8">
<meta name="keywords"  content="Tokens,Superinterface,Giramundonics">
<meta name="author"    content="Antonio Albuquerque,Vitor Mammana">
<link rel='stylesheet' href='../to_css/token_documentacao.css' type='text/css'>
</head>
<body onload="lista_h2()">
<div id="menu">
<span class="indice"><< Conteúdo >></span>
</div>

<div id="conteudo">
<h1>Módulo Token - Referência Técnica</h1>
<table>
<tr><td>
<img src="./token_wash.jpg" width="300"></td>
<td><div class="comentario">
<b>Bem vind@ ao Módulo de Tokens da Superinterface!</b>
<p></p><p></p>
A  Superinterface visa proporcionar o suporte tecnológico necessário para se criar um acervo documental na internet sobre uma determinada temática, podendo realizar buscas textuais e permitir à equipe envolvida com este acervo a possibilidade da entrada de metadados e outras informações sobre cada documento, de forma fácil e ágil. <br /><br />
Este Módulo da Superinterface permite que o usuário crie sua Árvore Hierárquica e forneça os tokens que classicarão o conjunto de palavras que aparecem nos arquivos que compõem o acervo da Superinterface. 
<p></p>
Este projeto é mais uma iniciativa do <a href="http://wash.net.br" target="_blank">Programa Wash</a> - Workshop Aficionados em Software e Hardware.

<br \><br \>Seja muito Bem Vind@, e aproveite!!
</div>
</td></tr></table>
<!--  ******************************************* -->
<h2 id="apresentacao">Apresentação</h2>
<p>A Superinterface é destinada a dar o suporte tecnológico para criação de acervos documentais digitais, agrupando todos e quaisquer documentos que estão relacionados a uma determinada questão específica de interesse de uma coletividade. O significado tomado aqui para "acervo" é de uma coleção de documentos. Assim, a Superinterface se presta a disponibilizar uma coleção de documentos na internet para consultas.</p>

<p>Este Módulo amplia o poder de análise da informação da Superinterface, possibilitando ao usuário construir sua Árvore Hierárquica de informações e fornecer seus tokens.  Dessa forma, cada palavra presente nos arquivos do acervo da Superinterface se constituirá numa fonte de informação que poderá revelar informações sobre a composição e o conhecimento armazenado no acervo.</p>
<!--  ******************************************* -->
<h2 id="manualinstalacao">Manual Instalação</h2>
<ol>
<!--
 ..................................................................................................
 -->
<li><h3 id="introducao">Introdução</h3></li>
<p>Antes de iniciar a instalação deste Módulo da Superinterface, considere ler com atenção esta documentação que objetiva ser um roteiro prático de auxílio ao instalador da solução. Os procedimentos de instalação deste módulo foram planejados de forma que a instalação seja realizada de maneira fácil e rápida.
<!--
 ..................................................................................................
-->

<li><h3 id="instalacao">Instalar o Módulo Tokens</h3></li>
<ol style="list-style-type:lower-alpha">
<li>Todo código do módulo e demais arquivos necessários ao seu funcionamento estão disponíveis no GitHub, bastando baixar a <a href="https://github.com/wash-git/Tokens" target="_blanck">última release do Módulo Tokens</a>;</li>
<li>Não é permitido realizar a instalação da aplicação como usuário root. Deve-se realizar todas instalação do código da aplicação Superinterface como um usuário normal, sem prerrogativas de administrador;</li>
<li> Desempacotar a aplicação na raiz (document root) do virtual host.  Para isto, utilize um dos seguintes comandos dependendo do pacote baixado (tar.gz
ou zip):</li><br />
<pre>
..../host1$  tar -xvf Tokens-1.0.tar.gz
..../host1$  unzip Tokens-1.0.zip
</pre>
Obs:  no exemplo acima, 1.0 se refere a versão da aplicação.  Verifique a versão baixada para fazer a montagem da instrução da forma correta.
<li>Após desempacotar a aplicação, as seguintes pastas e arquivos deverão estar presentes na raiz do virtual host:</li>
<p></p><pre>
.../host1/
	to_css/
	to_docs/
	to_help/
	to_images/
	to_info/
	to_install/
	to_js/
	to_php/
	tokens.html
	LICENSE
	README.md
</pre><p></p>
obs:<br \>
a) Em especial, a pasta to_install/ conterá os arquivos necessários à instalação da Superinterface<br />
b) O arquivo com a documentação técnica deste módulo (token_documentacao.php) poderá ser acessado via navegador da seguinte forma: &nbsp;&nbsp;&nbsp;
http://&#60;host-instalacao&#62;/to_docs/token_documentacao.php<br />
<p></p>
<li>Na pasta to_install/, alterar as propriedades dos seguintes arquivos conforme mostrado abaixo:</li>
<pre>
$  chmod 600 token_config.cnf
$  chmod 750 token_install.sh
</pre>
<p></p>
Obs: por segurança, não é recomendado que o usuário da aplicação tenha privilégios de criação de base de dados. 
<p></p>

<li>Reinstalar o módulo<br />
O Módulo Tokens pode ser reinstalado a qualquer momento sem maiores burocracias, repetindo o processo descrito.  Mas toda vez que se fizer a reinstalação, as tabelas existentes na base de dados relativas a este módulo serão apagadas e recriadas.  As demais tabelas relativas a outros módulos ou mesmo ao corpo principal da Superinterface não sofrerão alterações.
</li>
</ol>
</li>
<p></p><p></p>
<p>Pronto. Agora já se pode ter a primeira experiência de funcionamento do Módulo Token, a qual será descrita na próxima seção deste documento.</p>
<p></p>
<!--
 ..................................................................................................
-->
<li><h3 id="experiencia">Primeira Experiência</h3></li>
<p>O pacote do Módulo Token já vem completo para proporcionar uma primeira experiência de seu funcionamento. Para isto, é necessário apenas dois passos:</p>
<ul><li>ter instalado a Superinterface;</li>
<li>estando na pasta de instalação (to_install/), execute o script de instalação token_install.sh da seguinte forma:<br />
to_install$ ./token_scriptinicial.sh<p></p>
</ul><p></p>
<p>Acompanhe o log da instalação através do arquivo token_logshell.log que estará na pasta to_logs/.</p>
<p>Apenas isso. Depois é passar a se certificar que realmente tudo fora realizado durante a instalação e, em seguida,  passar a fazer os primeiros usos da utilização do Módulo, como mostra o roteiro a seguir: </p>
<ol style="list-style-type:lower-alpha">
<li>Se a instalação foi realizada com sucesso, ao seu final terá sido gerada pastas adicionais necessárias ao funcionamento da solução. Deverão existir as seguintes pastas:</li>

</pre>
<pre>
drwxr-x---  web1 web1  to_admin/
drwxr-x---  web1 web1  to_css/
drwxr-x---  web1 web1  to_docs/
drwxr-x---  web1 web1  to_help/
drwxr-x---  web1 web1  to_images/
drwxr-x---  web1 web1  to_info/
drwxr-x---  web1 web1  to_install/
drwxr-x---  web1 web1  to_js/
drwxr-x---  web1 web1  to_logs/
drwxr-x---  web1 web1  to_php/
</pre>
Explicações:
<ul>
  <li><strong> to_admin:</strong> pasta com os arquivos de configuração para o script PHP.</li>
  <li><strong> to_css:</strong> pasta com os arquivos de estilos do módulo.</li>
  <li><strong> to_docs:</strong> pasta com os arquivos relativos a documentação do módulo.</li>
  <li><strong> to_logs:</strong> pasta com os logs de instalação do módulo.</li>
  <li><strong> to_images:</strong> pasta com arquivos de imagens png, jpg, gif.</li>
  <li><strong> to_info:</strong> pasta destinada a conter o arquivo com a modelagem da Árvore Hierárquica fornecida pelo usuário.</li>  
  <li><strong> to_install:</strong> pasta com os arquivos de configuração e script shell necessário à instalação do módulo.</li>
  <li><strong> to_js:</strong> pasta com os arquivos javascript do módulo.</li>
  <li><strong> to_php:</strong> pasta com arquivos PHP necessários ao funcionamento do módulo.</li>
</ul>
<br />
<li>verifique através do arquivo de log  (vide seção <a href="#logs" title="Logs do Módulo Token">Registro de Logs</a>) se tudo foi realizado corretamente. Se a instalação chegou ao seu final com sucesso.  Mas se ocorrer algum problema na instalação, a indicação de problema estará sinalizada através do arquivo de log. Faça a correção necessária e volte a executar o script de instalação;</li><br />
<p>Com isso já podemos considerar que a instalação do Módulo Token está correta e a solução em pleno funcionamento.  Mas observe que está em funcionamento com a modelagem da Árvore Hierárquica que foi fornecida e com seu conjunto de informações associados.  Se a modelagem fornecida contempla as necessidades, tudo bem.  Pode-se continuar a utilizar o módulo do jeito que está, sem necessidade de qualquer modificação.</p>
<p>No entanto se há uma necessidade diferente, é necessário fornecer uma outra Árvore Hierárquica.  É isso que a próxima seção deste documento tentará explicar.</p>
<p></p><br />
</ol>
<!--
 ..................................................................................................
-->
<li><h3 id="arvore">Árvore Hierárquica</h3></li>
<p>A modelagem da Árvore Hierárquica é uma tarefa crucial para o bom funcionamento do módulo. A partir desta modelagem será possível realizar as seguintes operações:</p>
<ul>
<li>a inserção de forma automatizada de tokens na base de dados;</li>
<li>facilidades aos usuários de manipulação de tokens com integridade.</li>
</ul>
<p>Assim, preparar a Árvore Hierárquica obedecendo algumas regras é fator crucial para sucesso do funcionamento do módulo. Regras estas que estaremos descrevendo a partir de agora.</p>
<p>Sugerimos a leitura de dois documentos que embasam todo trabalho de modelagem da Árvore Hierárquica:
<ul>
<li><a href="http://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/" target="_blanck">Managing Hierarchical Data in MySQL</a></li>
<li><a href="./token_arvoreLinguaPortuguesa.pdf" target="_blanck">Árvore Hierárquica da Estrutura Gramatical da Língua Portuguesa</a></li>
</ul>
<p>Os dois documentos acima demonstram como os tokens são agrupados e aninhados de acordo com o “nested set model”.</p> 
</p>
<p></p>
<!--
 ..................................................................................................
-->
<li><h3 id="configuracao">Configuração</h3></li>
<p>Existe um arquivo de configuração do módulo, mas não há necessidade de qualquer modificação neste arquivo. Este arquivo está disponível em to_install/token_config.cnf.</p>
<p></p>
<!--
 ..................................................................................................
-->
<li><h3 id="logs">Registro de Logs</h3></li>
<p>Todos os procedimentos de instalação do módulo são registrados em seu arquivo de log de forma a permitir ao usuário administrador o seu acompanhamento. A pasta de logs deste módulo está em to_logs/token_logshell.log</p>

<p>É muito importante verificar o arquivo de log, certificando que todas as operações de instalação foram realizadas sem ocorrências de exceções.</p>
<p>Código de cores: para facilitar a visualização das mensagens, estas obedecem um código de cores: (a) na cor branca estão as mensagens informativas; (b) na cor azul, as operações mais críticas e que foram realizadas com sucesso; (c) e na cor vermelha, as mensagens de exceções, possivelmente alguma ação imprópria da aplicação, e que merecem uma intervenção do administrador do serviço.</p>
<!--
 ..................................................................................................
-->
<li><h3 id="troubleshoot">Troubleshoot</h3>
<p>Durante a instalação, caso se verifique alguma anormalidade, o arquivo de log terá o registro da ocorrência. Após realizar o diagnóstico do problema e ter solucionado a dificuldade, (re)instale a solução via seu comando padrão:</p>
to_install$ ./token_scriptinicial.sh<br /><br />
<!--
 ..................................................................................................
-->
<li><h3 id="perguntasinstalacao">Perguntas Recorrentes</h3></li>
<ol style="list-style-type:square;">
<li>Desejo utilizar o Módulo Token conforme foi fornecido.  Tenho de realizar algum procedimento especial?</li>
Não há necessidade.  É só usar o módulo pois ele já vem pronto para uso. Mas observe que por padrão o módulo utiliza a modelagem da "Árvore Hierárquica da Estrutura Gramatical da Língua Portuguesa". Também vem fornecido uma outra modelagem demo que está em to_info/token_nestedClasses-transporte.csv.  Se desejar utilizar esta modelagem, copie este arquivo para token_nestedClasses.csv (antes salvando este arquivo para possível futuro uso).
<li>Irei utilizar uma outra Árvore Hierárquica.  O que preciso mudar?</li>
Disponibilize sua Árvore Hierárquica em to_info/token_nestedClasses.csv.  Como sugestão, salve aquele arquivo com outro nome antes de ser substituído pelo novo arquivo.
</ol>
</ol>
<!--  ******************************************* -->
<h2 id="manual_usuario">Manual do Usuário</h2>
<ol>
<!--
 ..................................................................................................
-->
<li><h3 id="menuprincipal">Menu Principal</h3></li>
O acesso pelo navegador ao módulo token se realiza por http://&lt;seu host&gt;/tokens.html
</ol>

</div>
<script type="text/javascript">
function lista_h2(){
var i;
$x=document.querySelectorAll('h2,h3');
menuzinho=document.getElementById("menu");
menuzinho.innerHTML=menuzinho.innerHTML+"<br><br>";
for (i=0; i<$x.length; i++){
	if ($x[i].tagName == "H2" ) {
		menuzinho.innerHTML=menuzinho.innerHTML+"<br>* <a class='lista_de_conteudo2' href='#"+$x[i].id+"'>"+$x[i].innerHTML+"</a><br>";
	}
	else {    /*  será H3 */
		menuzinho.innerHTML=menuzinho.innerHTML+"&ensp;<a class='lista_de_conteudo3' href='#"+$x[i].id+"'>"+$x[i].innerHTML+"</a><br>";
	}
}
}
</script>
</body>
</html>

