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
var	token_dados = {
	id_pagina : {
		"CENTRAL":"main",
		"LATERAL":"secondary",
		"LEAD":"lead",
		"LADO_A":"ladoA",
		"LADO_B":"ladoB",
		"FORM1" : "idform1",
		"FORM2" : "idform2",
		"FORM3" : "idform3",
		"SUBCLA": "subcla",
		"TOKEN" : "token"
	},
	arq_html :  {
		"HOME" : "to_help/token_home.html",
		"HATOKENS" : "to_help/token_atokens.html",
		"HGCLASS"  : "to_help/token_grafo.html",
		"HVERBET"  : "to_help/token_verbetes.html",
		"HSTATIS"  : "to_help/token_classificar.html",
		"HAPRESE"  : "to_help/token_apresentacao.html"
	},
	classes : [],
	classes_pai : [],				// lista das classes PAI: [desc,id na base dados]
	classe_paiselected : [false,,],	// [Selecionou?, ID de entrada na base de dados, descrição]
	subclasse_selected : [false,,], // [Selecionou?, ID de ebtrada na base de dados, descrição]
	subclasses : []
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
		MENS_08 = "Formulário-3: Tokens";
	const MENS_ER01 = "Erro-01: parâmetro 'local' inexistente",
		MENS_ER02 = "Erro-02: problemas na comunicação JSON";
	//
	switch(p_acao) {
        case    'TRATAR_ESCOLHA':
			/*vsis_dados.jsonFuncoes.carregarIndicador(); */
			//console.log("vamos tratar");
			return;
        case    'INICIAR':
			toRequisitarHtml(token_dados.arq_html.HOME, 'LATERAL');
			toRequisitarHtml(token_dados.arq_html.HAPRESE, 'CENTRAL');
			break;
		case	'HOME':
			toRequisitarHtml(token_dados.arq_html.HOME, 'LATERAL');
			toRequisitarHtml(token_dados.arq_html.HAPRESE, 'CENTRAL');
			break;	
		case	'HATOKENS':	// ação: tokens
			toRequisitarHtml(token_dados.arq_html[p_acao],'LATERAL');
			toRequisitarJson('CENTRAL');
			break;
		case    'HSTATIST':
			toRequisitarHtml(token_dados.arq_html[p_acao],'LATERAL');
			break;
		case    'HGCLASS':
			toRequisitarHtml(token_dados.arq_html[p_acao],'LATERAL');
			break;
		case    'HVERBET':
			toRequisitarHtml(token_dados.arq_html[p_acao],'LATERAL');
			break;
		case	'RESPOSTA_HTML':
			toPublicarTexto(p_param1,p_param2);			
			break;
		case	'RESPOSTA_JSON':
			toMontarForm1();			
			break;
		case	'RESPOSTA_TOKEN':
			//										resposta do servido após usuário solicitar inserção de token
			toDigitarToken(p_param1);
			break;
		case	'TIMEOUT':
			window.alert("timeout ",p_param1);
			break
        default:
            window.alert("erro");
            return false;
    }
	/*
	*	FUNÇÃO INFORMAR ERRO
	*/
	function toTratarErro(e){
		alert(e);
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
				toTratarErro(MENS_ER01);
				return;
		}
		var vobjetoAjax=toIniciarAjax();					// instanciar um objeto XMLHttpRequest para a requisição
		if (vobjetoAjax) {									// verifica se o objeto XMLHttpRequest foi criardo
			vobjetoAjax.onreadystatechange = function() {
															// propriedade onreadyStatechange:
															// ação disparadora de evento, originada no servidor
															// disparada por uma propriedade do objeto XMLHttpRequest
				if (vobjetoAjax.readyState === 4 && vobjetoAjax.status === 200 ) { 		// se requisição completa e bem-sucedida
					var type = vobjetoAjax.getResponseHeader("Content-Type");
					if (type.match(/^text/))											// certifica-se de que a resposta seja texto
						toFrontEnd('RESPOSTA_HTML',vobjetoAjax.responseText,local);	// passa a resposta para função callback
				}
			};
			vobjetoAjax.open("GET",arquivo,true);			// open: informa ao servidor o endereço do arquivo que está sendo requisitado
															// true= comunicação assíncrona
			vobjetoAjax.setRequestHeader("Content-Type","text/plain;charset=UTF-8");	// informa que o corpo do pedido está em texto puro
			vobjetoAjax.send(null);							// send: inicia a requisição definida pelo método open anterior
															// null pois não temos dados a enviar
		} // if
	} // fim função toRequisitarHtml
	//
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO REQUISITAR DADOS JSON NO SERVIDOR                       *
	** *************************************************************************************** */
	//
	function toRequisitarJson (local) {
		var requisicaoAjax3 = toIniciarAjax(); 
		if(requisicaoAjax3) {
			requisicaoAjax3.onreadystatechange = function () {	// ação disparadora de evento, originada no servidor
															// houve uma mudança no status de comunicação entre o servidor e o navegador
															// disparada por uma propriedade do objeto XMLHttpRequest
				if(requisicaoAjax3.readyState == 4) {
					if(requisicaoAjax3.status == 200 || requisicaoAjax3.status == 304) {	
						//console.log("chegou resposta= ",requisicaoAjax3.getResponseHeader("Content-Type"));
						//console.log("objeto= ",requisicaoAjax3);
						if (requisicaoAjax3.getResponseHeader("Content-Type") == "application/json"){
							token_dados.classes=JSON.parse(requisicaoAjax3.responseText);   // converter o string JSON em um objeto Javascript
							//console.log("token_dados.classes= ", token_dados.classes);
							toFrontEnd('RESPOSTA_JSON');	// callback
						}
					}
				}
			}
			requisicaoAjax3.open("POST", 'to_php/token_processa.php', true);		// open: informa ao servidor o endereço do arquivo que está sendo requisitado
															// geralmente usa-se GET quando não se envia dados ao servidor
															// true= comunicação assíncrona
			requisicaoAjax3.timeout = 4000;					// tempo limite em milisegundos para aguardar a resposta
			requisicaoAjax3.ontimeout = function() {toFrontEnd('TIMEOUT',"tempo excedido");};

			requisicaoAjax3.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
			var dados='acao=arvore';
			requisicaoAjax3.send(dados);						// send: inicia a requisição definida pelo método open anterior
															// será enviado os dados da requisição ao servidor (neste caso é null pois não temos dados a enviar)
		}
	}	// fim função toRequisitarJson
	//
	/* *************************************************************************************** **
	*                            FUNÇÃO MONTAR FORMULÁRIO 1: ESCOLHA CLASSE PAI                 *
	** *************************************************************************************** */
	//
	function toMontarForm1(requisicaoAjax3,local) {
		var i=0, j=0, array2=[], array3=[];
		//													limpar referência a qualquer seleção de classe anterior
		token_dados.classes_pai=[];
		token_dados.classe_paiselected=[];
		token_dados.subclasse_selected=[];
		token_dados.subclasses=[];
		//													Selecionar as classes PAI
		for (i=0;i<token_dados.classes[0].length;i++) {
			if (token_dados.classes[0][i].tela == 1) {
				let aa = {
					"desc": token_dados.classes[0][i].descricao,
					"ident":token_dados.classes[0][i].id_chave_classe
				}
				token_dados.classes_pai.push(aa);
			}
		}
		//console.log("token_dados.classes_pai= ",token_dados.classes_pai);
		//													Divide a tela central em duas partes: LADO-A e LADO-B
		toPublicarTexto("",'CENTRAL');							// limpa toda tela 'CENTRAL'
		var aa = document.createElement ("div");			// prepara criação um novo elemento div 
		document.getElementById(token_dados.id_pagina['CENTRAL']).appendChild (aa);	// insere o novo div na página
		aa.setAttribute('id',token_dados.id_pagina['LADO_A']);						// definir o atributo do novo elemento div: LADO_A
		aa = document.createElement ("div");									// cria main um novo elemento div
		document.getElementById(token_dados.id_pagina['CENTRAL']).appendChild (aa);	// insere o novo div na página
		aa.setAttribute('id',token_dados.id_pagina['LADO_B']);						// definir o atributo do elemento div criado
		//
		for (let j in token_dados.classes_pai){
			//console.log(token_dados.classes_pai[j].desc);
			array2[j]=token_dados.classes_pai[j].desc;
		}
		//console.log("array2= ",array2);
		array3=array2.join('<br />');												// formata lista de classes PAI para enviar ao LADO-B
		toPublicarTexto("<h2>"+MENS_01+"</h2>"+array3,'LADO_B');							// imprime no LADO-B as classes PAI existentes
		//
		//																			Cria um formulário para seleção da classe PAI
		toPublicarTexto("<h2>"+MENS_04+"</h2>",'LADO_A');								// msg para escolher a classe pai
		var vele = document.createElement("div");									// cria um novo elemento div dentro de LADO_A
		vele.setAttribute("class","selclasse");
		vele.setAttribute("id",token_dados.id_pagina['FORM1']);
		document.getElementById(token_dados.id_pagina['LADO_A']).appendChild(vele);
		var vform="<form action=\"#\" method=\"post\" id=\"demoForm\" class=\"demoForm\">";	// cria o formulário
		vform+="<fieldset id=\"field01\"><legend>"+MENS_03+"</legend><p>";
		vform+="<select id=\"optclasse\" name=\"scripts\">";
		for (let j in array2){
			vform+="<option value=\""+j+"\">"+array2[j]+"</option>";
		}
		vform+="</select>";
		vform+="<input type=\"text\" size=\"40\" name=\"display\" id=\"optindice\" readonly /></p>";
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
			token_dados.classe_paiselected=[true,token_dados.classes_pai[sel.value].ident-1,sel.options[sel.selectedIndex].text]; // guarda a escolha
			//console.log("classe_paiselected= ", token_dados.classe_paiselected);
			//toPublicarTexto ("<h2>"+MENS_02+token_dados.classe_paiselected[2]+"</h2>",'LADO_A');
			//												limpar divs inferiores
			if ( document.getElementById(token_dados.id_pagina['FORM3']) != null )
			document.getElementById(token_dados.id_pagina['FORM3']).innerHTML = "";
			if ( document.getElementById(token_dados.id_pagina['SUBCLA']) != null )
			document.getElementById(token_dados.id_pagina['SUBCLA']).innerHTML = "";
			//																				identificar as subclasses
			j=0;
			var a1=Number(token_dados.classes[0][token_dados.classe_paiselected[1]].lft);
			var a2=Number(token_dados.classes[0][token_dados.classe_paiselected[1]].rgt);
			token_dados.subclasses=[],j=0;
			for (let i in token_dados.classes[0]){
				//console.log("token_dados.classes[0][i].left= ",i,"  ", token_dados.classes[0][i].left);
				if (
					(token_dados.classes[0][i].lft >= a1) && 
					(token_dados.classes[0][i].lft <= a2) && 
					(token_dados.classes[0][i].opcao == 1)
				){
					token_dados.subclasses[j]=[i,token_dados.classes[0][i].descricao];
					j++;
				} // if
			} // for
			//console.log("token_dados.subclasses= ",token_dados.subclasses);
			array2=[],array3=[];
			for (let j in token_dados.subclasses){
				array2[j]=token_dados.subclasses[j][1];
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
		token_dados.subclasse_selected=[];
		vele = document.createElement ("div");										// prepara criação um novo elemento div 
		vele.setAttribute('id',token_dados.id_pagina['SUBCLA']);						// cria um novo elemento div dentro de LADO_A
		document.getElementById(token_dados.id_pagina['LADO_A']).appendChild (vele); // insere o novo div na página
		toPublicarTexto("<h2>"+MENS_06+"</h2>",'SUBCLA');									// msg para escolher a Subclasse
		vele = document.createElement ("div");										// prepara criação um novo elemento div 
		vele.setAttribute("class","selclasse");
		vele.setAttribute('id',token_dados.id_pagina['FORM2']);						// cria um novo elemento div dentro de LADO_A
		document.getElementById(token_dados.id_pagina['SUBCLA']).appendChild (vele); // insere o novo div na página
		//														preparar array2
		for (let j in token_dados.subclasses){
			//console.log(token_dados.classes_pai[j].desc);
			array2[j]=token_dados.subclasses[j][1];
		}
		//console.log("array2= ",array2);
		//
		//														Criar o formulário para a sub-classe
		vform="<form action=\"#\" method=\"post\" id=\"demoForm\" class=\"demoForm\">";
		vform+="<fieldset id=\"field02\" class=\"formclass\"><legend>"+MENS_07+"</legend><p>";
		vform+="<select id=\"optclasse2\" name=\"scripts\">";
		for (let j in array2){
			vform+="<option value=\""+j+"\">"+array2[j]+"</option>";
		}
		vform+="</select>";
		vform+="<input type=\"text\" size=\"40\" name=\"display\" id=\"optindice2\" readonly /></p>";
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
			token_dados.subclasse_selected=[true,Number(token_dados.subclasses[sel.value][0]),sel.options[sel.selectedIndex].text]; // guarda a escolha
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
		console.log("iniciar montagem do formulário 3");

			//													Preparar espaço para titulo da caixa de edição do token
			vele = document.createElement ("div");										// prepara criação um novo elemento div 
			vele.setAttribute('id',token_dados.id_pagina['FORM3']);						// cria um novo elemento div dentro de LADO_A
			document.getElementById(token_dados.id_pagina['LADO_A']).appendChild (vele); // insere o novo div na página
			toPublicarTexto("<h2>"+MENS_08+"</h2>",'FORM3');									// msg para escolher a Subclasse
			vele = document.createElement ("div");										// prepara criação um novo elemento div 
			vele.setAttribute("class","selclasse");
			vele.setAttribute('id',token_dados.id_pagina['TOKEN']);						// cria um novo elemento div dentro de LADO_A
			document.getElementById(token_dados.id_pagina['FORM3']).appendChild (vele); // insere o novo div na página
			//
			//													Prepara o formulário para fornecimento do token
			vform="<form action=\"#\" method=\"post\" id=\"formtoken\">";
			vform+="<fieldset id=\"field03\">";
			vform+="<legend>Digite o token:</legend>";
			vform+="<label for=\"tokenxx\">Token:</label>";
			vform+="<input type=\"text\" id=\"tokenxx\" name=\"tokenxx\" placeholder=\"digite o token\">";
			vform+="<label for=\"tokenaa\"></label>";
			vform+="<input type=\"text\" size=\"30\" name=\"display2\" id=\"optindice3\" placeholder=\"Resultado\" readonly /></p>";
			vform+="<input type=\"button\" id=\"botaotokenxx\" value=\"Enviar\" />";
			vform+="</fieldset></form>";
			toPublicarTexto(vform,'TOKEN');
			// 													obter referências para identificar os itens da seleção
			var sel3 = document.getElementById('tokenxx');
			var elresp3 = document.getElementById('optindice3');
			//													tratador para o botão de escolha da classe PAI
			document.getElementById('botaotokenxx').onclick = function () {
				//console.log("sel3= ",sel3.value);
				//console.log("elresp3= ",elresp3.value);
				// enviar token para o servidor
				toEnviarDado("novotoken",sel3.value,token_dados.subclasse_selected[1]+1);	// envia o id da sub-classe
																							// adicionamos 1 porque o SGBD inicia os registros em 1 (em vez de 0)
			}

	}	// fim da função toMontarForm3
	//
	/* *************************************************************************************** **
	*                FUNÇÃO MOSTRAR RESPOSTA DO SERVIDOR AO FAZER INSERÇÃO TOKEN                *
	** *************************************************************************************** */
	//
	function	toDigitarToken(texto) {
		var selres= document.getElementById('optindice3');
		var seltok= document.getElementById('tokenxx');
		selres.value = texto;
		seltok.value = "";

	} // fim da função toDigitarToken
	//
	//
	//
	//
	//
	function toEnviarDado(param1,param2,param3){
		// enviar dado ao servidor
		//console.log("enviando dado ao servidor= ",param1,"    ",param2);
		var objetoAjax = toIniciarAjax();
		if(objetoAjax) {
			objetoAjax.onreadystatechange = function () {	// ação disparadora de evento, originada no servidor
															// houve uma mudança no status de comunicação entre o servidor e o navegador
															// disparada por uma propriedade do objeto XMLHttpRequest
				if(objetoAjax.readyState == 4) {
					if(objetoAjax.status == 200 || objetoAjax.status == 304) {
						var type = objetoAjax.getResponseHeader("Content-Type");
						if (type.match(/^text/))				// certifica-se de que a resposta seja texto
                       		toFrontEnd('RESPOSTA_TOKEN',objetoAjax.responseText); // passa a resposta para função callback
                   	}
				}
			};
			objetoAjax.open("POST","to_php/token_processa.php",true);
			objetoAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
			var dados='acao='+param1+'&token='+param2+'&id='+param3;
			//console.log("dados= ",dados);
			objetoAjax.send(dados);
		}
	} // fim função toEnviarDado()
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
		var vInsereAqui = document.getElementById(token_dados.id_pagina[local]);
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