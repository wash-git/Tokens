/*
* +--------------------------------------------------------------------+
* | Programa Wash - Módulo de Classes Tokens version 2.0               |
* +--------------------------------------------------------------------+
* | Copyright Observatorio LLC (c) 2022    Antonio Albuquerque         |
* +--------------------------------------------------------------------+
* | This file is a part of Wash Project development.                   |
* | Wash program:  http://wash.net.br
* |                                                                    |
* | The JavaScript code in this page is free software: you can copy,   |
* | modify, redistribute it under the terms of the GNU General Public  |
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
"use strict";	// ECMAScript5
//	definição da variável global
var	tokenDados = {
	id_pagina : {
		"TITULO": "titulo",
		"CENTRAL":"main",
		"LATERAL":"secondary",
		"LEAD":"lead",
		"LADO_A":"ladoA",
		"LADO_B":"ladoB",
		"FORM1" : "idform1",
		"FORM2" : "idform2",
		"FORM3" : "idform3",
		"SUBCLA": "subcla",
		"TOKEN" : "token",
		"MENSAG": "mensag"
	},
	arq_html :  {
		"HOME" : "to_help/token_home.html",
		"HCTOKENS" : "to_help/token_atokens.html",		// criat tokens
		"HLTOKENS"  :"to_help/token_ltokens.html",
		"HVERBET"  : "to_help/token_verbetes.html",
		"HSTATUS"  : "to_help/token_status.html",
		"HAPRESE"  : "to_help/token_apresentacao.html"
	},
	classes : [],
	classesRequisited : false,	// se o objeto tokenDados.classes (com a lista de classes) já está disponível
	classes_pai : [],				// lista das classes PAI: [desc,id na base dados]
	num_subclasses : 0,				// número total de subclasses passíveis de classificar tokens
	classe_paiselected : [false,,],	// [Selecionou?, ID de entrada na base de dados, descrição]
	subclasse_selected : [false,,], // [Selecionou?, ID de ebtrada na base de dados, descrição]
	subclasses : [],
	tokens : []
};
    /*
										--- FRONT END DA APLICAÇÃO ---
    */
function toFrontEnd(p_acao,p_param1,p_param2) {	
	// variáveis da função
	var vlocal;
	var vobjetoAjax;
	var vInsereAqui;
	const MENS_01 = "Classes 'PAI'",
		MENS_02 = "Sub-classes para ",
		MENS_03 = "Escolha a Classe PAI",
		MENS_04 = "Formulário-1: Classe PAI",
		MENS_05 = "Sub-classes possíveis",
		MENS_06 = "Formulário-2: Sub-Classe",
		MENS_07 = "Escolha a Sub-Classe",
		MENS_08 = "Formulário-3: Tokens",
		MENS_09 = "Tokens na base de dados",
		MENS_10 = "Status",
		MENS_11 = "Verbetes na base de dados",
		MENS_12 = "Facilidade: ",
		MENS_13 = "Verbetes",
		MENS_14 = "Listar Tokens",
		MENS_15 = "Criar Tokens",
		MENS_16 = "Módulo: ",
		MENS_17 = "Tokens - Árvore Hierárquica",
		MENS_18 = "Token inserido no sistema: ";
	const	MENS_ER01 = "Erro-01: parâmetro 'local' inexistente",
			MENS_ER02 = "Erro-02: problemas na comunicação JSON",
			MENS_ER03 = "Erro-03: falha na comunicação com o servidor",
			MENS_ER04 = "Erro-04: falha na comunicação com o servidor",
			MENS_ER05 = "Erro-05: é necessário primeiro obter a Árvore Hierárquica, o que ainda não foi obtida",
			MENS_ER06 = "Erro-06: não foi identificado para qual funcionalidade o JSON foi obtido",
			MENS_ER07 = "Erro-07: não foi obtido resposta do servidor após enviar novo token",
			MENS_ER08 = "Erro-08: serviço de dados de verbetes teve insucesso na conexão com a base de dados",
			MENS_ER09 = "Erro-09: serviço de dados de verbetes não encontrou nenhum verbete na base de dados",
			MENS_ER10 = "Erro-10: não foi possível se conectar com a base de dados para fazer a inserção do novo token. Token não inserido",
			MENS_ER11 = "Erro-11: serviço de dados de tokens não encontrou dados na sua base de dados", 
			MENS_ER12 = "Erro-12: não foi possível fazer inserção do novo token na base de dados";
	//
	document.getElementById(tokenDados.id_pagina['MENSAG']).innerHTML = "";			// limpar área de avisos do Módulo
	document.getElementById(tokenDados.id_pagina['MENSAG']).setAttribute("class", "invisib");
	switch(p_acao) {
        case    'TRATAR_ESCOLHA':
			return;
        case    'INICIAR':				// chamada apenas na carga inicial do Módulo
			toPublicarTexto("<h1><span class=\"section\">"+MENS_16+"</span>"+MENS_17+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HOME, 'LATERAL');
			toRequisitarHtml(tokenDados.arq_html.HAPRESE, 'CENTRAL');
			toRequisitarJson('CENTRAL','HOME');
			break;
		case	'HOME':					// página inicial: chamada todas as vezes que o internauta usa a opção do menu HOME
			toPublicarTexto("<h1 id=\"lead\"><span class=\"section\">"+MENS_16+"</span>"+MENS_17+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HOME, 'LATERAL');
			toRequisitarHtml(tokenDados.arq_html.HAPRESE, 'CENTRAL');
			if ( ! tokenDados.classesRequisited ) {
				toRequisitarJson('CENTRAL','HOME');
			}
			break;	
		case	'HCTOKENS':				// ação: criar tokens
			document.getElementById(tokenDados.id_pagina['CENTRAL']).innerHTML = "";		// limpar área da tela principal
			toPublicarTexto("<h1 id=\"lead\"><span class=\"section\">"+MENS_12+"</span>"+MENS_15+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HCTOKENS,'LATERAL');
			if ( ! tokenDados.classesRequisited ) {
				toRequisitarJson('CENTRAL','HCTOKENS');									// requisitar as classes (que ainda não estão disponíveis localmente)
			} else {
				toMontarForm1();
			}
			break;
		case	'HLTOKENS':				// ação: listar tokens
			toPublicarTexto("<h1 id=\"lead\"><span class=\"section\">"+MENS_12+"</span>"+MENS_14+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HLTOKENS,'LATERAL');
			toRequisitarTokens('CENTRAL','HLTOKENS');
			break;
		case    'HSTATUS':
			toPublicarTexto("<h1 id=\"lead\"><span class=\"section\">"+MENS_12+"</span>"+MENS_10+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HSTATUS,'LATERAL');
			toMostrarStatus();
			break;
		case    'HVERBET':				// ação: listar os verbetes
			toPublicarTexto("<h1 id=\"lead\"><span class=\"section\">"+MENS_12+"</span>"+MENS_13+"</h1>",'TITULO'); 
			toRequisitarHtml(tokenDados.arq_html.HVERBET,'LATERAL');
			toRequisitarVerbetes('CENTRAL','HVERBET');
			break;
		case	'RESPOSTA_HTML':
			toPublicarTexto(p_param1,p_param2);			
			break;
		case	'RESPOSTA_JSON':
			if (p_param1 == 'HCTOKENS'){				// resposta para criar tokens
				tokenDados.classes=p_param2;
				tokenDados.classesRequisited=true;
				toMontarForm1();
			} else if (p_param1 == 'HOME') {			// resposta quando da iniciação do Módulo (solicitação da Árvore de Classes)
				toMontarArvore(p_param2);
			} else if (p_param1 == 'HLTOKENS') {		// resposta para listar tokens
				if ( ! tokenDados.classesRequisited ) {
					alert ("Ooooops.  Classes ainda não disponíveis");
				} else {
					tokenDados.tokens=p_param2.values;
					toMontarListagemTokens();
				}
			} else if (p_param1 == 'HVERBET') {			// resposta para listagem de verbetes
				if ( p_param2.resultado == 'TRUE' ) {
					toMontarListagemVerbetes(p_param2);
				} else {
					switch(p_param2.values){
						case 0:
							toMensagErro(MENS_ER08);
							break;
						case 1:
							toMensagErro(MENS_ER09);
							break;
						default:
							toMensagErro(MENS_ER10);
							break;
					}
				}
			} else {
				fMensagErro(MENS_ER06);
			}
			break;
		case	'RESPOSTA_TOKEN':
			//										resposta do servido após usuário solicitar inserção de token
			if ( p_param1.resultado == 'TRUE' ){
				toDigitarToken(p_param1);
			}else {
				switch(p_param1.values){
					case 0:
						toMensagErro(MENS_ER10);
						break;
					case 1:
						toMensagErro(MENS_ER11);
						break;
					default:
						toMensagErro(MENS_ER12);
						break;
				}
			}
			break;
		case	'TIMEOUT':
			window.alert("timeout ",p_param1);
			break
        default:
            window.alert("erro");
            return false;
    }
	//
	//
	/*
	* FUNÇÕES REQUISITAR E MOSTRAR_RESPOSTA  - HTML
	*/


	//
	/* *************************************************************************************** **
	*                         FUNÇÃO REQUISITAR DADOS HTML NO SERVIDOR                          *
	** *************************************************************************************** */
	//
	function toRequisitarHtml (arquivo,local) {
		// arquivo - nome do arquivo HTML a ser buscado
		// local - local na estrutura da página onde publicar o conteúdo do arquivo (exemplos: CENTRAL, LATERAL)
		switch(local) {
			case	'LATERAL':
			case	'CENTRAL':
				break;
			default:
				toMensagErro(MENS_ER01);
				return;
		}
		var vobjetoAjax=toIniciarAjax();					// instanciar um objeto XMLHttpRequest para a requisição
		if (vobjetoAjax) {									// verifica se o objeto XMLHttpRequest foi criado
			var timedout=false;
			var timer = setTimeout(function() {				// abre uma temporização para a resposta do servidor chegar
									timedout = true;
									vobjetoAjax.abort();
									toMensagErro (MENS_ER03);
			},2000);											// 2segundos
//			var timer = setTimeout(tratarTimeoutComunicacao (vobjetoAjax,timedout),200);
			vobjetoAjax.onreadystatechange = function() {
															// propriedade onreadyStatechange:
															// ação disparadora de evento, originada no servidor
															// disparada por uma propriedade do objeto XMLHttpRequest
				if (vobjetoAjax.readyState === 4 && vobjetoAjax.status === 200 ) { 		// se requisição completa e bem-sucedida
					if (timedout) return;					// ignora requisições canceladas
					var type = vobjetoAjax.getResponseHeader("Content-Type");
					if (type.match(/^text/)) {				// certifica-se de que a resposta seja texto
						clearTimeout(timer);				// cancela tempo-limite pendente
						toFrontEnd('RESPOSTA_HTML',vobjetoAjax.responseText,local);	// *** callback ***
					}
				}
			};
			vobjetoAjax.open("GET",arquivo,true);			// open: informa ao servidor o endereço do arquivo que está sendo requisitado
															// true= comunicação assíncrona
			vobjetoAjax.setRequestHeader("Content-Type","text/plain;charset=UTF-8");	// informa que o corpo do pedido está em texto puro
			vobjetoAjax.send(null);							// send: inicia a requisição definida pelo método open anterior
															// null pois não temos dados a enviar
		} // if
	} // fim função toRequisitarHtml
	/* *************************************************************************************** **
	*                            FUNÇÃO ENVIAR MENSAGEM DE ERRO                                 *
	** *************************************************************************************** */
	//
	function toMensagErro(mens) {
		document.getElementById(tokenDados.id_pagina['MENSAG']).innerHTML = mens;
		document.getElementById("mensag").setAttribute("class", "visib");
	}
	//
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO REQUISITAR DADOS JSON NO SERVIDOR                       *
	** *************************************************************************************** */
	//
	function toRequisitarJson (local,funcao) {
		var dados,resposta, timer;
		var timedout=false;
		var requisicaoAjax3 = toIniciarAjax(); 
		if(requisicaoAjax3) {
			timer =setTimeout(function() {						// abre uma temporização para a resposta do servidor chegar
									timedout = true;
									requisicaoAjax3.abort();
									toMensagErro (MENS_ER04);
			},4000);											// 4segundos

			requisicaoAjax3.onreadystatechange = function () {	// ação disparadora de evento, originada no servidor
																// houve uma mudança no status de comunicação entre o servidor e o navegador
																// disparada por uma propriedade do objeto XMLHttpRequest
				if(requisicaoAjax3.readyState == 4) {
					if(requisicaoAjax3.status == 200 || requisicaoAjax3.status == 304) {
						if (timedout) return;									// ignora requisições canceladas
						if (requisicaoAjax3.getResponseHeader("Content-Type") == "application/json"){
							clearTimeout(timer);								// cancela tempo-limite pendente
							resposta=JSON.parse(requisicaoAjax3.responseText);	// converter o string JSON em um objeto Javascript
							toFrontEnd('RESPOSTA_JSON',funcao,resposta);		// **** callback ****
						}
					}
				}
			}
			switch(funcao){
				case 'HOME':
				case 'HCTOKENS':	
					requisicaoAjax3.open("POST", 'to_php/token_processa.php', true);	// open: informa ao servidor o endereço do arquivo que está sendo requisitado
															// geralmente usa-se GET quando não se envia dados ao servidor
															// true= comunicação assíncrona
					requisicaoAjax3.timeout = 4000;			// tempo limite em milisegundos para aguardar a resposta
					requisicaoAjax3.ontimeout = function() {toFrontEnd('TIMEOUT',"tempo excedido");};
					requisicaoAjax3.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
					dados='acao=arvore';
					break;
				case 'HLTOKENS':
					requisicaoAjax3.open("POST", 'to_php/token_processa.php', true);
					requisicaoAjax3.timeout = 4000;			
					requisicaoAjax3.ontimeout = function() {toFrontEnd('TIMEOUT',"tempo excedido");};
					requisicaoAjax3.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
					dados='acao=listarTokens';
					break;
				case 'HVERBET':
					requisicaoAjax3.open("POST", 've_php/verb_processa.php', true);
					requisicaoAjax3.timeout = 4000;			
					requisicaoAjax3.ontimeout = function() {toFrontEnd('TIMEOUT',"tempo excedido");};
					requisicaoAjax3.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
					dados='acao=listarVerbetes';
					break;
				default:
					toMensagErro(MENS_ER02);
					return;
			}
			requisicaoAjax3.send(dados);						// send: inicia a requisição definida pelo método open anterior
															// será enviado os dados da requisição ao servidor (neste caso é null pois não temos dados a enviar)
		}
	}	// fim função toRequisitarJson
	//
	/* *************************************************************************************** **
	*                                   FUNÇÃO MOSTRAR STATUS                                   *
	** *************************************************************************************** */
	//
	function toMostrarStatus() {
		var array4=[];
		toPublicarTexto("",'CENTRAL');                          // limpa toda tela 'CENTRAL'
		if ( ! tokenDados.classesRequisited ) {
			toMensagErro(MENS_ER05);
			return;
		}
		array4="<table id=\"tabletokens\"><tr><th>Indicador</th><th>Valor</th></tr>";
		array4+="<tr><td>Classes</td><td>"+tokenDados.classes[0].length+"</td></tr>";
		array4+="<tr><td>Classes PAI</td><td>"+tokenDados.classes_pai.length+"</td></tr>";
		array4+="<tr><td>Subclasses (como opção de classificação)</td><td>"+tokenDados.num_subclasses+"</td></tr>";
		array4+="</table>";
		toPublicarTexto(array4,'CENTRAL');	// informações do status
	}
	//
	/* *************************************************************************************** **
	*                                   FUNÇÃO REQUISITAR TOKENS                                    *
	** *************************************************************************************** */
	//
	function toRequisitarTokens(local,funcao) {
		toPublicarTexto("",'CENTRAL');							// limpa toda tela 'CENTRAL'
		toRequisitarJson (local,funcao);
	}
	//
	/* *************************************************************************************** **
	*                                   FUNÇÃO REQUISITAR VERBETES                              *
	** *************************************************************************************** */
	//
	function toRequisitarVerbetes(local,funcao) {
		toPublicarTexto("",'CENTRAL');						// limpa toda tela 'CENTRAL'
		toRequisitarJson (local,funcao);
	}
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR DADOS DA ÁRVORE HIERARQUICA                      *
	** *************************************************************************************** */
	//
	function toMontarArvore(arvore) {
		var i;
		tokenDados.classes=arvore.values;					// guarda a informação das classes de tokens existentes
		tokenDados.classesRequisited=true;					// classes de tokens estão disponíveis para utilização
		//													Selecionar as classes PAI
		for (i=0;i<tokenDados.classes.length;i++) {
			if (tokenDados.classes[i].pai == 1) {
				tokenDados.classes_pai.push({"desc": tokenDados.classes[i].descricao,"ident":tokenDados.classes[i].id_chave_classe});
			}
		} // for
		for ( let i in tokenDados.classes){					// calcula o número de subclasses passíveis de classificar um token
			if ( tokenDados.classes[i].opcao != 0 ) {
				tokenDados.num_subclasses++;
			}
		} // for

	} // fim da função toMontarArvore()
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR LISTAGEM DE TOKENS                               *
	** *************************************************************************************** */
	//
	function toMontarListagemTokens(){
		var array2=[],array3=[],array4;
		for (let j in tokenDados.tokens){
			array2[j]=tokenDados.tokens[j].token_name;
		}
		array4="<table id=\"tabletokens\"><tr><th>Token</th><th>Descrição</th></tr>";
		for (let j in tokenDados.tokens){
			array4+="<tr><td>"+tokenDados.tokens[j].token_name+"</td><td>"+tokenDados.classes[Number(tokenDados.tokens[j].id_classe)-1].descricao+"</td></tr>";
		}
		array4+="</table>";
		array3=array2.join('<br />');
		toPublicarTexto("<h2>"+MENS_09+"</h2>"+array4,'CENTRAL'); // imprime tokens existentes
	}
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR LISTAGEM DE VERBETES                             *
	** *************************************************************************************** */
	//
	function toMontarListagemVerbetes(p_verbetes){
		var score=[0,0,0,0,0,0,0], array4;
		var faixa=["mais de 100 ocorrências",
			"40 < ocorrênicas < 100",
			"20 < ocorrências < 40",
			"10 < ocorrências < 20",
			"5 < ocorrências < 10",
			"2 < ocorrênicas < 5",
			"1 ocorrência apenas"];
		for (let j in p_verbetes.values){
			if (p_verbetes.values[j].ocorrencias > 100){		// mais de 100 ocorrências
				score[0] +=1;
			} else if (p_verbetes.values[j].ocorrencias > 40) {	// entre 40 e 100 ocorrências
				score[1] +=1;
			} else if (p_verbetes.values[j].ocorrencias > 20) {	// entre 20 e 40 ocorrências
				score[2]++;
			} else if (p_verbetes.values[j].ocorrencias > 10) {	// entre 10 e 20 ocorrências
				score[3]++;
			} else if (p_verbetes.values[j].ocorrencias > 5) {	// entre 5 e 10 ocorrências
				score[4]++;
			} else if (p_verbetes.values[j].ocorrencias > 2) {	// entre 2 e 5 ocorrências
				score[5]++;
			} else if (p_verbetes.values[j].ocorrencias =1) {	// uma ocorrência
				score[6]++;
			} else {
				alert("valor estranho");
			}
		}
		array4="<table id=\"tabletokens\"><tr><th>Faixa</th><th>Quantidade de Verbetes</th></tr>";
		for (let j in score) {
			array4+="<tr><td>"+faixa[j]+"</td><td>"+score[j]+"</td></tr>";
		}
		array4+="</table>";
		toPublicarTexto("<h2>"+MENS_11+"</h2>"+array4,'CENTRAL');   // imprime os índices dos verbetes existentes
	}
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR FORMULÁRIO 1: ESCOLHA CLASSE PAI                 *
	** *************************************************************************************** */
	//
	function toMontarForm1(requisicaoAjax3,local) {
		var i=0, j=0, array2=[], array3=[], pai_lft,pai_rgt;
		//																			limpar referência a qualquer seleção de classe anterior
		tokenDados.classe_paiselected=[];
		tokenDados.subclasse_selected=[];
		tokenDados.subclasses=[];
		//																			Selecionar as classes PAI
		//																			Divide a tela central em duas partes: LADO-A e LADO-B
		toPublicarTexto("",'CENTRAL');												// limpa toda tela 'CENTRAL'
		var aa = document.createElement ("div");									// prepara criação um novo elemento div 
		document.getElementById(tokenDados.id_pagina['CENTRAL']).appendChild (aa);	// insere o novo div na página
		aa.setAttribute('id',tokenDados.id_pagina['LADO_A']);						// definir o atributo do novo elemento div: LADO_A
		aa = document.createElement ("div");										// cria main um novo elemento div
		document.getElementById(tokenDados.id_pagina['CENTRAL']).appendChild (aa);	// insere o novo div na página
		aa.setAttribute('id',tokenDados.id_pagina['LADO_B']);						// definir o atributo do elemento div criado
		//
		for (let j in tokenDados.classes_pai){										// seleciona o nome das classes PAI
			array2[j]=tokenDados.classes_pai[j].desc;
		}
		array3=array2.join('<br />');												// formata lista de classes PAI para enviar ao LADO-B
		toPublicarTexto("<h2>"+MENS_01+"</h2>"+array3,'LADO_B');					// imprime no LADO-B as classes PAI existentes
		//
		toPublicarTexto("<h2>"+MENS_04+"</h2>",'LADO_A');							// msg para escolher a Subclasse
		//																			Cria um formulário para seleção da classe PAI
		var vele = document.createElement("div");									// cria um novo elemento div dentro de LADO_A
		vele.setAttribute("class","selclasse");
		vele.setAttribute("id",tokenDados.id_pagina['FORM1']);
		document.getElementById(tokenDados.id_pagina['LADO_A']).appendChild(vele);
		var vform="<form action=\"#\" method=\"post\" id=\"demoForm\" class=\"demoForm\">";	// cria o formulário
		vform+="<fieldset id=\"field01\"><legend>"+MENS_03+"</legend><p>";
		vform+="<select id=\"optclasse\" name=\"scripts\">";
		for (let j in array2){
			vform+="<option value=\""+j+"\">"+array2[j]+"</option>";
		}
		vform+="</select>";
		vform+="<input type=\"text\" size=\"35\" name=\"display\" id=\"optindice\" readonly /></p>";
		//vform+="<p><input type=\"button\" id=\"botaoindice\" value=\"Índice Selecionado\" />";
		vform+="<input type=\"button\" id=\"botaotexto\" value=\"Selecionar\" />";
		vform+="</fieldset></form>";
		toPublicarTexto(vform,'FORM1');
		// 													obter referências para identificar os itens da seleção
		var sel = document.getElementById('optclasse');
		var el = document.getElementById('optindice');
		//													tratador para o botão de escolha da classe PAI
		document.getElementById('botaotexto').onclick = function () {	
			el.value = sel.options[sel.selectedIndex].text;	// acessar a propriedade text da opção selecionada
			tokenDados.classe_paiselected=[true,tokenDados.classes_pai[sel.value].ident-1,sel.options[sel.selectedIndex].text]; // guarda a escolha
			//												limpar divs inferiores
			if ( document.getElementById(tokenDados.id_pagina['FORM3']) != null )
			document.getElementById(tokenDados.id_pagina['FORM3']).innerHTML = "";
			if ( document.getElementById(tokenDados.id_pagina['SUBCLA']) != null )
			document.getElementById(tokenDados.id_pagina['SUBCLA']).innerHTML = "";
			//																				identificar as subclasses
			j=0;
			pai_lft=Number(tokenDados.classes[tokenDados.classe_paiselected[1]].lft);
			pai_rgt=Number(tokenDados.classes[tokenDados.classe_paiselected[1]].rgt);
			tokenDados.subclasses=[],j=0;
			for (let i in tokenDados.classes){
				if (
					(tokenDados.classes[i].lft >= pai_lft) && 
					(tokenDados.classes[i].lft <= pai_rgt) && 
					(tokenDados.classes[i].opcao == 1)
				){
					tokenDados.subclasses[j]=[i,tokenDados.classes[i].descricao];
					j++;
				} // if
			} // for
			array2=[],array3=[];
			for (let j in tokenDados.subclasses){
				array2[j]=tokenDados.subclasses[j][1];
			}
			array3=array2.join('<br />');
			toPublicarTexto("",'LADO_B');							// limpa  'LADO_B'
			toPublicarTexto("<h2>"+MENS_05+"</h2>"+array3,'LADO_B');							// imprime no LADO-B as sub classes com opcoes
			toMontarForm2();
		}
	}	// fim função toMontarForm1
	//
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR FORMULÁRIO-2: SUB-CLASSES                        *
	** *************************************************************************************** */
	//
	function toMontarForm2() {
		var vele, vform, array2=[];
		//																			limpar qualquer referência anterior a uma subclasse selecionada
		tokenDados.subclasse_selected=[];
		vele = document.createElement ("div");										// prepara criação um novo elemento div 
		vele.setAttribute('id',tokenDados.id_pagina['SUBCLA']);						// cria um novo elemento div dentro de LADO_A
		document.getElementById(tokenDados.id_pagina['LADO_A']).appendChild (vele); // insere o novo div na página
		toPublicarTexto("<h2>"+MENS_06+"</h2>",'SUBCLA');									// msg para escolher a Subclasse
		vele = document.createElement ("div");										// prepara criação um novo elemento div 
		vele.setAttribute("class","selclasse");
		vele.setAttribute('id',tokenDados.id_pagina['FORM2']);						// cria um novo elemento div dentro de LADO_A
		document.getElementById(tokenDados.id_pagina['SUBCLA']).appendChild (vele); // insere o novo div na página
		//														preparar array2
		for (let j in tokenDados.subclasses){
			array2[j]=tokenDados.subclasses[j][1];
		}
		//
		//														Criar o formulário para a sub-classe
		vform="<form action=\"#\" method=\"post\" id=\"demoForm\" class=\"demoForm\">";
		//vform+="<fieldset id=\"field02\" class=\"formclass\"><legend>"+MENS_07+"</legend><p>";
		vform+="<fieldset id=\"field02\" ><legend>"+MENS_07+"</legend><p>";
		vform+="<select id=\"optclasse2\" name=\"scripts\">";
		for (let j in array2){
			vform+="<option value=\""+j+"\">"+array2[j]+"</option>";
		}
		vform+="</select>";
		vform+="<input type=\"text\" size=\"35\" name=\"display\" id=\"optindice2\" readonly /></p>";
		//vform+="<p><input type=\"button\" id=\"botaoindice\" value=\"Índice Selecionado\" />";
		vform+="<input type=\"button\" id=\"botaotexto2\" value=\"Selecionar\" />";
		vform+="</fieldset></form>";
		toPublicarTexto(vform,'FORM2');
		// 													obter referências para identificar os itens da seleção
		var sel = document.getElementById('optclasse2');
		var el = document.getElementById('optindice2');
		//														tratador para o botão de escolha da sub-classe
		document.getElementById('botaotexto2').onclick = function () {	
			el.value = sel.options[sel.selectedIndex].text;	// acessar a propriedade text da opção selecionada
			tokenDados.subclasse_selected=[true,Number(tokenDados.subclasses[sel.value][0]),sel.options[sel.selectedIndex].text]; // guarda a escolha
			toMontarForm3();
		}
	}	// fim função toMontarForm2()
	//
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR FORMULÁRIO-3: DIGITAR TOKENS                     *
	** *************************************************************************************** */
	//
	function toMontarForm3() {
		var vele, vform;
			//													Preparar espaço para titulo da caixa de edição do token
			vele = document.createElement ("div");										// prepara criação um novo elemento div 
			vele.setAttribute('id',tokenDados.id_pagina['FORM3']);						// cria um novo elemento div dentro de LADO_A
			document.getElementById(tokenDados.id_pagina['LADO_A']).appendChild (vele); // insere o novo div na página
			toPublicarTexto("<h2>"+MENS_08+"</h2>",'FORM3');									// msg para escolher a Subclasse
			vele = document.createElement ("div");										// prepara criação um novo elemento div 
			vele.setAttribute("class","selclasse");
			vele.setAttribute('id',tokenDados.id_pagina['TOKEN']);						// cria um novo elemento div dentro de LADO_A
			document.getElementById(tokenDados.id_pagina['FORM3']).appendChild (vele); // insere o novo div na página
			//
			//													Prepara o formulário para fornecimento do token
			vform="<form action=\"#\" method=\"post\" id=\"formtoken\">";
			vform+="<fieldset id=\"field03\">";
			vform+="<legend>Digite o token:</legend>";
			//vform+="<label for=\"tokenxx\">Token:</label>";
			vform+="<input type=\"text\" id=\"tokenxx\" name=\"tokenxx\" placeholder=\"digite o token\">";
			//vform+="<label for=\"tokenaa\"></label>";
			vform+="<input type=\"text\" size=\"35\" name=\"display2\" id=\"optindice3\" placeholder=\"Resultado\" readonly /></p>";
			vform+="<input type=\"button\" id=\"botaotokenxx\" value=\"Enviar\" />";
			vform+="</fieldset></form>";
			toPublicarTexto(vform,'TOKEN');
			// 													obter referências para identificar os itens da seleção
			var sel3 = document.getElementById('tokenxx');
			var elresp3 = document.getElementById('optindice3');
			//													tratador para o botão de escolha da classe PAI
			document.getElementById('botaotokenxx').onclick = function () {
				// enviar token para o servidor
				toEnviarToken("novotoken",sel3.value,tokenDados.subclasse_selected[1]+1);	// envia o id da sub-classe
																							// adicionamos 1 porque o SGBD inicia os registros em 1 (em vez de 0)
			}

	}	// fim da função toMontarForm3
	//
	/* *************************************************************************************** **
	*                FUNÇÃO MOSTRAR RESPOSTA DO SERVIDOR AO FAZER INSERÇÃO TOKEN                *
	** *************************************************************************************** */
	//
	function	toDigitarToken(resposta) {
		var selres= document.getElementById('optindice3');
		var seltok= document.getElementById('tokenxx');
		selres.value = MENS_18+resposta.values;
		seltok.value = "";

	} // fim da função toDigitarToken
	//
	//
	//
	//
	//
	function toEnviarToken(param1,param2,param3){
		// enviar dado ao servidor
		var timer, resposta;
		var timedout=false;
		var objetoAjax = toIniciarAjax();
		if(objetoAjax) {
		timer =setTimeout(function() {						// abre uma temporização para a resposta do servidor chegar
									timedout = true;
									objetoAjax.abort();
									toMensagErro (MENS_ER07);
			},4000);											// 4segundos
			objetoAjax.onreadystatechange = function () {	// ação disparadora de evento, originada no servidor
															// houve uma mudança no status de comunicação entre o servidor e o navegador
															// disparada por uma propriedade do objeto XMLHttpRequest
				if(objetoAjax.readyState == 4) {
					if(objetoAjax.status == 200 || objetoAjax.status == 304) {
						if (timedout) return;
						if (objetoAjax.getResponseHeader("Content-Type") == "application/json"){	// certifica-se que a resposta é um JSON
							clearTimeout(timer);
							resposta=JSON.parse(objetoAjax.responseText);	// converter o string JSON em um objeto Javascript
                       		toFrontEnd('RESPOSTA_TOKEN',resposta); // *** callback ***
						}
                   	}
				}
			};
			objetoAjax.open("POST","to_php/token_processa.php",true);
			objetoAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
			var dados='acao='+param1+'&token='+param2+'&id='+param3;
			objetoAjax.send(dados);
		}
	} // fim função toEnviarToken()
	//
	/* *************************************************************************************** **
	*                         FUNÇÃO TRATAR DADOS HTML ENVIADOS PELO SERVIDOR                   *
	** *************************************************************************************** */
	//
	function toTratarDadosHtml(requisicaoAjax2) {
		if(requisicaoAjax2.readyState == 4) {
			if(requisicaoAjax2.status == 200 || requisicaoAjax2.status == 304) {
				var dados = requisicaoAjax2.responseXML;
				var tituloDado = dados.getElementsByTagName("titulo")[0].firstChild.nodeValue;
				var autorDado = dados.getElementsByTagName("autor")[0].firstChild.nodeValue;
				var siteDado = dados.getElementsByTagName("site")[0].firstChild.nodeValue;
	
				var titulo = document.createElement("h2"); 
				var site = document.createElement("a");
 				site.setAttribute("href", siteDado);
				var textoTitulo = document.createTextNode(tituloDado);
				site.appendChild(textoTitulo);
				titulo.appendChild(site);
	
				var autor = document.createElement("p"); 
				var textoAutor = document.createTextNode(autorDado);
				autor.appendChild(textoAutor);
	
				var insere = document.getElementById("secondary");
				while (insere.hasChildNodes()) {
					insere.removeChild(insere.lastChild);
				}
	
				insere.appendChild(titulo);
				insere.appendChild(autor);
	
			} else {
				alert("Problema na comunicação com o servidor");
			}
		}	
	}	// fim função toTratarDadosHtml
	//
	//
	/* *************************************************************************************** **
	*                         FUNÇÃO PARA PUBLICAR TEXTO HTML NA PÁGINA                         *
	** *************************************************************************************** */
	//
	function toPublicarTexto(texto,local) {
		var vInsereAqui = document.getElementById(tokenDados.id_pagina[local]);
        vInsereAqui.innerHTML = texto;	
	}	// fim função toPublicarTexto
	//
	//
	/* *************************************************************************************** **
	*                         FUNÇÃO PARA INICIAR O OBJETO XMLHttpRequest                       *
	** *************************************************************************************** */
	//
	function toIniciarAjax() {
        vobjetoAjax = false;
                if (window.XMLHttpRequest) {
                        vobjetoAjax = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
                try {           
                vobjetoAjax = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e) {
                        try {
                        vobjetoAjax = new ActiveXObject("Microsoft.XMLHTTP");                    
                } catch(ex) {   
                vobjetoAjax = false;
       }
                }
        }
        return vobjetoAjax;
	} /* fim função toIniciarAjax */
	//
	//
} /* ********************  fim da função  toFrontEnd() ************************** */
window.onload = toFrontEnd("INICIAR");
