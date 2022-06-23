<?php
//	por segurança, evitar cacheamento: não armazenar a página em cache
$gmtDate = gmdate("D, d M Y H:i:s");
header("Expires: {gmtDate} GMT");
header("Last-Modified: {gmtDate} GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
//
require_once("../to_admin/token_config_php.cnf");
$acao=$_POST["acao"];
switch ($acao) {
	case 'novotoken':
		$token=$_POST["token"];
		$id=$_POST["id"];
		// novo token
		inserirNovoToken($token,$id,$username,$pass,$banco);
		break;
	case 'arvore':
		// solicitação da árvore hierárquica de classes
		pedidoArvoreClasse($username,$pass,$banco);
		break;
	case 'listarTokens':
		pedidoListarTokens($username,$pass,$banco);
		break;
	default:
		break;
}
//
function	pedidoListarTokens($username,$pass,$banco) {
	// solicitado informar quais tokens existem na base
	$link = mysqli_connect("localhost",$username, $pass, $banco);
	$sql = "SELECT * FROM  to_tokens";
	$result=mysqli_query($link, $sql);
	mysqli_close($link);
	if (! mysqli_num_rows($result) > 0) {
		echo "Não encontrou resultados";
		return;
	}
	while ($row = mysqli_fetch_assoc($result)) {
    	$output[] = $row;
    }
	header("Content-Type: application/json", true);
	echo json_encode(array($output));
}
//
function	inserirNovoToken($token,$id,$username,$pass,$banco) {
	// Criar uma conexão com a base de dados
	header('Content-Type:text/plain; charset=UTF-8');
	$link = mysqli_connect("localhost",$username, $pass, $banco);
	$sql = "INSERT INTO  to_tokens(token_name,id_classe) VALUES ('$token','$id')";
	if (mysqli_query($link, $sql)) {
  		echo $token.": foi inserido na base de dados";
	} else {
  		echo "Error: " . $sql . " " . mysqli_error($link);
	}
	mysqli_close($conn);
}
// 
function	pedidoArvoreClasse($username,$pass,$banco) {
	// solicitado a árvore hierárquica de classe
	//$nome="../to_help/teste_json.json";
	$link = mysqli_connect("localhost",$username,$pass, $banco);
	// verificar a conexão com o banco de dados
	if (mysqli_connect_errno()) {
		// falha para se conectar ao MySQL
		die("falha na conexão com o banco de dados");
	}
	$result=mysqli_query($link, "SELECT * from to_nested_classes");
	mysqli_close($link);
	if (! mysqli_num_rows($result) > 0) {
		echo "Não encontrou resultados";
		return;
	}
	while ($row = mysqli_fetch_assoc($result)) {
    	$output[] = $row;
    }
	//echo json_encode(($result->fetch_array()));
	header("Content-Type: application/json", true);
	echo json_encode(array($output));
}
?>

