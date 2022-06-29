<?php
/*
* +--------------------------------------------------------------------+
* | Programa Wash - Módulo Tokens            version 2.0               |
* +--------------------------------------------------------------------+
* | Copyright Observatorio LLC (c) 2022    Antonio Albuquerque         |
* +--------------------------------------------------------------------+
* | This file is a part of Wash Project development.                   |
* | Wash program:  http://wash.net.br
* |                                                                    |
* | This PHP code is free software: you can copy, modify,              |
* | redistribute it under the terms of the GNU General Public          |
* | License (GNU-GPL) as published by the Free Software Foundation,    |
* | either version 3 of the License, or (at your option) any later     |
* | version.                                                           |
* |                                                                    |
* | This program is distributed in the hope that it will be useful,    |
* | but WITHOUT ANY WARRANTY; without even the implied warranty of     |
* | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the      |
* | GNU Lesser General Public License for more details.                |
* |                                                                    |
* | A copy of the GNU Lesser General Public License is available at    |
* | <http://www.gnu.org/licenses/lgpl-3.0.html>.                       |
* +--------------------------------------------------------------------+
*/
#
/*
+-----------------------------------------------------------------------------------+
Esse provedor de dados envia a resposta através de um Json com a seguinte estrutura:
{"result":"FAlSE/TRUE","values":_____}

Onde:
	"result":
		FALSE: se houve um problema na execução do serviço solicitado
		TRUE: serviço executado com sucesso. Outras informações estarão listadas em "values".
	"values":
		se "result"=FALSE, conterá um código de erro.
		se "result"=TRUE, conterá os dados solicitados ou outras informações

	Códifos de erro (quando "result"=FALSE):
		0 = não foi possível se conectar com a base de dados.
		1 = não foram encontrados dados
		2 = não foi possível inserir valores na base de dados
+-----------------------------------------------------------------------------------+
*/
#
require_once("../to_admin/token_config_php.cnf");
//	por segurança, evitar cacheamento: não armazenar a página em cache
$gmtDate = gmdate("D, d M Y H:i:s");
header("Expires: {gmtDate} GMT");
header("Last-Modified: {gmtDate} GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
//
$acao=$_POST["acao"];
switch ($acao) {
	case 'novotoken':
		$token=$_POST["token"];
		$id=$_POST["id"];
		// novo token
		inserirNovoToken($token,$id);
		break;
	case 'arvore':
		// solicitação da árvore hierárquica de classes
		pedidoArvoreClasse();
		break;
	case 'listarTokens':
		pedidoListarTokens();
		break;
	default:
		break;
}
//
function	pedidoListarTokens() {
	// solicitado informar quais tokens existem na base
	global $username,$pass,$banco;
	//	por segurança, evitar cacheamento: não armazenar a página em cache
	$gmtDate = gmdate("D, d M Y H:i:s");
	header("Expires: {gmtDate} GMT");
	header("Last-Modified: {gmtDate} GMT");
	header("Cache-Control: no-cache, must-revalidate");
	header("Pragma: no-cache");
	$link = mysqli_connect("localhost",$username, $pass, $banco);
	if ( mysqli_connect_errno()) {
  		$result='FALSE';
  		$values=0;
	}else {
		$sql = "SELECT * FROM  to_tokens";
		$result=mysqli_query($link, $sql);
		mysqli_close($link);
		if (! mysqli_num_rows($result) > 0) {
			// 								não encontrou resultados
			$result='FALSE';
			$values=1;
		}else {
			while ($row = mysqli_fetch_assoc($result)) {
    		$values[] = $row;
    	}
		$result='TRUE';
		}
	}
	#										enviar resposta
	header("Content-Type: application/json", true);
	echo json_encode(array('resultado' => $result, 'values' => $values));
}
//
function	inserirNovoToken($token,$id) {
	// Criar uma conexão com a base de dados
	global $username,$pass,$banco;
	//	por segurança, evitar cacheamento: não armazenar a página em cache
	$gmtDate = gmdate("D, d M Y H:i:s");
	header("Expires: {gmtDate} GMT");
	header("Last-Modified: {gmtDate} GMT");
	header("Cache-Control: no-cache, must-revalidate");
	header("Pragma: no-cache");
	$link = mysqli_connect("localhost",$username, $pass, $banco);
	if ( mysqli_connect_errno()) {					// verificar a conexão com o banco de dados
  		$result='FALSE';
  		$values=0;
	}else {
		$sql = "INSERT INTO  to_tokens(token_name,id_classe) VALUES ('$token','$id')";
		if (mysqli_query($link, $sql)) {
  			$result='TRUE';
			$values=$token;
		}else {
  			$result='FALSE';
			$values=2;
		}
	}
	mysqli_close($link);
	//												enviar resposta
	header("Content-Type: application/json", true);
	echo json_encode(array('resultado' => $result, 'values' => $values));
}
// 
function	pedidoArvoreClasse() {
	// solicitado a árvore hierárquica de classe
	global $username,$pass,$banco;
	//	por segurança, evitar cacheamento: não armazenar a página em cache
	$gmtDate = gmdate("D, d M Y H:i:s");
	header("Expires: {gmtDate} GMT");
	header("Last-Modified: {gmtDate} GMT");
	header("Cache-Control: no-cache, must-revalidate");
	header("Pragma: no-cache");
	$link = mysqli_connect("localhost",$username,$pass, $banco);
	if ( mysqli_connect_errno()) {					// verificar a conexão com o banco de dados
  		$result='FALSE';
  		$values=0;
	}else {
		$sql="SELECT * from to_nested_classes";
		$result=mysqli_query($link,$sql);
		mysqli_close($link);
		if (! mysqli_num_rows($result) > 0) {
			//										não encontrou resultados
			$result='FALSE';
			$values=1;
		}else {
			while ($row = mysqli_fetch_assoc($result)) {
    			$values[] = $row;
    		}
		}
		$result='TRUE';
	}
	//												enviar resposta
	header("Content-Type: application/json", true);
	echo json_encode(array('resultado' => $result, 'values' => $values));
}
?>

