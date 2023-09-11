% Bibliotecas
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).

%:- use_module(library(http/http_unix_daemon)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).

% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

:- json_object agenda_maq_json_array(array:list(agenda_maq_json)).
:- json_object agenda_maq_json(maquina:string,agenda_array:list(agenda_json)).
:- json_object agenda_json(instanteInicial:float,instanteFinal:float,tipoProcessamento:string,lista:list(string)).

% Funções do Servidor
:- set_setting(http:cors, [*]).

% Relação entre pedidos HTTP e predicados que os processam
:- http_handler('/pedido_traj_rapida', pedido_traj_rapida, []).
:- http_handler('/pedido_heuristica_armazem', pedido_heuristica_armazem, []).
:- http_handler('/pedido_heuristica_entrega', pedido_heuristica_entrega, []).
:- http_handler('/pedido_heuristica_tempo_massa', pedido_heuristica_tempo_massa, []).
:- http_handler('/pedido_algoritmo_genetico', pedido_algoritmo_genetico, []).

% Base de Conhecimento
:- dynamic idArmazem/2.
:- dynamic entrega/6.
:- dynamic carateristicasCam/6.
:- dynamic cidadeArmazem/1.

% -------------------------------------------------------------------------------------------------------: BASE DE DADOS DINÂMICA :---------------------------------------------------------------------------------------------------------.

criarBaseDeConhecimento:-adicionarArmazens(),
                        adicionarEntregas(),
                        adicionarCamioes(),
                        /*adicionarPercursos(),*/
                        adicionarArmazemPrincipal().


%idArmazem(<local>,<codigo>)

adicionarArmazens():-
	http_open('https://localhost:5001/api/Armazem', In, []),
	json_read_dict(In, Data),
	parse_armazens(Data, ResultList),
	criarArmazensDinamicamente(ResultList),
	close(In).

parse_armazens([],[]).
parse_armazens([H|T],[(H.designcacao, H.id)|L]):-parse_armazens(T, L).

criarArmazensDinamicamente([]).
criarArmazensDinamicamente([(D, I)|L]):-assert(idArmazem(D, I)),
	                                  criarArmazensDinamicamente(L).

%entrega(<idEntrega>,<data>,<massaEntrega>,<armazemEntrega>,<tempoColoc>,<tempoRet>)

adicionarEntregas():-
	http_open('https://localhost:5001/api/Entrega/', In, []),
	json_read_dict(In, Data),
	parse_entregas(Data, ResultList),
  criarEntregasDinamicamente(ResultList),
	close(In).

parse_entregas([],[]).
parse_entregas([H|T],[(H.id, DataEntrega, H.peso, H.idArmazem.value, H.tempoCarregamento, H.tempoDescarregamento)|L]):- atom_number(H.dataEntrega, X),
                                                                                                                        atom_number(DataEntrega, X),
                                                                                                                        parse_entregas(T, L).

criarEntregasDinamicamente([]).
criarEntregasDinamicamente([(Id,Data,Massa,Armazem,TempoColoc,TempoRet)|L]):-assert(entrega(Id,Data,Massa,Armazem,TempoColoc,TempoRet)),
	                                  criarEntregasDinamicamente(L).


%carateristicasCam(<nome_camiao>,<tara>,<capacidade_carga>,<carga_total_baterias>,<autonomia>,<t_recarr_bat_20a80>).

adicionarCamioes():-
  http_open('http://localhost:3000/api/camioes/camioesExistentes', In, []),
	json_read_dict(In, Data),
  parse_camioes(Data, ResultList),
  criarCamioesDinamicamente(ResultList),
	close(In).


parse_camioes([],[]).
parse_camioes([H|T],[(X, H.tara, H.maximoCarga, H.cargaTotalBaterias, H.autonomia, H.tempoCarregamento)|L]):-atom_string(X, H.nomeCamiao),
                                                                                                                        parse_camioes(T, L).


criarCamioesDinamicamente([]).
criarCamioesDinamicamente([(NomeCamiao,Tara,CapacidadeCarga,CargaTotalBaterias,Autonomia,TempoRecarrBat)|L]):-assert(carateristicasCam(NomeCamiao,Tara,CapacidadeCarga,CargaTotalBaterias,Autonomia,TempoRecarrBat)),
	                                                                                                            criarCamioesDinamicamente(L).

%dadosCam_t_e_ta(<nome_camiao>,<cidade_origem>,<cidade_destino>,<tempo>,<energia>,<tempo_adicional>).

adicionarPercursos():-
  http_open('http://localhost:3000/api/percursos/todos', In, []),
	json_read_dict(In, Data),
  parse_percursos(Data, ResultList),
  criarPercursosDinamicamente(ResultList),
	close(In).


parse_percursos([],[]).
parse_percursos([H|T],[(H.armazemPartida, H.armazemChegada, H.distancia, H.duracao, H.energiaGasta, H.tempoExtra)|L]):-parse_percursos(T, L).


criarPercursosDinamicamente([]).
criarPercursosDinamicamente([(ArmazemPartida, ArmazemChegada, _, Duracao, EnergiaGasta, TempoExtra)|L]):-assert(dadosCam_t_e_ta('eTruck01',ArmazemPartida,ArmazemChegada,Duracao,EnergiaGasta,TempoExtra)),
	                                                                                                            criarPercursosDinamicamente(L).


adicionarArmazemPrincipal():-assert(cidadeArmazem("5")).

% -------------------------------------------------------------------------------------------------------: PEDIDOS HTTP :---------------------------------------------------------------------------------------------------------.

pedido_traj_rapida(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    traj_mais_rapida(L,Tempo, Data, Camiao, _), 
    prolog_to_json(L, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).


pedido_heuristica_armazem(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    heuristica_armazem(Data, Camiao, Trajetoria, Tempo),
    prolog_to_json(Trajetoria, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

pedido_heuristica_entrega(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    heuristicaEntrega(Data, Camiao, Trajetoria, Tempo),
    prolog_to_json(Trajetoria, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

pedido_heuristica_tempo_massa(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    heuristica_tempo_massa(Data, Camiao, Trajetoria, Tempo),
    prolog_to_json(Trajetoria, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

    pedido_algoritmo_genetico(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, [])
                    ]),
    geraARQSI2(Data,eTruck01,M,T,NumEntregas,6,8,50,25,5,3),
    prolog_to_json(M, JSONObject),
    prolog_to_json(T, JSONObject2),
    prolog_to_json(NumEntregas, JSONObject3),
    reply_json([JSONObject2, JSONObject, JSONObject3], [json_object(dict)]).

% -------------------------------------------------------------------------------------------------------: GERIR SERVIDOR :---------------------------------------------------------------------------------------------------------.
startServer(Port) :-
    http_server(http_dispatch, [port(Port)]).

stopServer:-
    retract(port(Port)),
    http_stop_server(Port,_).

:- initialization(startServer(5026)).

% --------------------------------------------------------------------------------------------------------: PREDICADOS :-----------------------------------------------------------------------------------------------------.

obter_armazens(L, Data):-findall(Armazem, (entrega(_,Data,_,Id,_,_), idArmazem(Armazem, Id)),L).

% obtém a lista com todas as trajetórias SEM o armazém inicial e final (Matosinhos)
lista_trajetorias(LT, Data):- obter_armazens(LA, Data),
                findall(Trajetoria, permutation(LA, Trajetoria), LT).


% para obter a lista com o armazém inicial e final

trajetoria_completa(LI, LF):-cidadeArmazem(Id),
                    idArmazem(Nome, Id),
                    append([Nome|LI],[Nome],LF).

trajetorias_final(LF, Data):-lista_trajetorias(LT, Data),
                        trajetorias_final2(LT, LF).


trajetorias_final2([],[]).
trajetorias_final2([T|LT], [R|LF]):-trajetoria_completa(T, R),
                                    write(R),nl,
                                    trajetorias_final2(LT, LF).


% avaliar essas trajetórias de acordo com o tempo para completar
% todas as entregas e voltar ao armazém base de Matosinhos e escolher a
% solução que permite a volta com o camião mais cedo

% calcula o total de carga que o camião transporta desde a 1ª cidade (Matosinhos) até à última
% acrescentando no último elemento 0 pois é quando o camião sai da última cidade vazio até Matosinhos

soma_carga([],[0],0).
soma_carga([IdArm|LA], [MassaAc|LP], MassaAc):-soma_carga(LA, LP, MassaAc1),
                                        entrega(_,_,Massa,IdArm,_,_),
                                        MassaAc is MassaAc1+Massa.



calcula_tempo(L,Tempo, Data, C):-soma_carga(L, LP,_),
                        cidadeArmazem(Id),
                        append([Id|L],[Id],LCompleto),
                        carateristicasCam(C,_,_,CargaTotalBaterias,_,_),
                        tempo(LCompleto,LP,CargaTotalBaterias,Tempo, Data, C).



tempo_ultDist([Id1,Id2],[PesoAt],EnergDispAt,Tempo, C):-dadosCam_t_e_ta(_, Id1, Id2, Temp, EnergiaMax, TempAdicional),
                                                        carateristicasCam(C,Tara,CapCarga,CargaTotalBaterias,_,_),
                                                        PesoMax is Tara+CapCarga,
                                                        PesoTotal is Tara+PesoAt,
                                                        TempoAtual is Temp*PesoTotal/PesoMax,
                                                        Energia is EnergiaMax*PesoTotal/PesoMax,
                                                        EnergiaDisponivel is EnergDispAt - Energia,
                                                        ((EnergiaDisponivel<(0.2*CargaTotalBaterias),! ,
                                                        TempoExtra is TempAdicional);(TempoExtra is 0)),
                                                        Tempo is TempoAtual+TempoExtra.



tempo([Id1,Id2],[PesoAt],EnergDispAt,Tempo,_,C):-
                                                tempo_ultDist([Id1,Id2],[PesoAt],EnergDispAt, Tempo, C).

tempo([Id1,Id2,Id3|LCompleto], [PesoAt,PesoAt2|LP], EnergDispAt, Tempo, Data, C):-
                                    dadosCam_t_e_ta(_, Id1, Id2, Temp, EnergiaMax, TempAdicional),
                                    entrega(_,Data,_,Id2,_,TempoRet),
                                    carateristicasCam(C,Tara,CapCarga,CargaTotalBaterias,_,_),
                                    PesoMax is Tara+CapCarga,
                                    PesoTotal is Tara+PesoAt,
                                    TempoAtual is Temp*PesoTotal/PesoMax,
                                    Energia is EnergiaMax*PesoTotal/PesoMax,
                                    EnergiaDisponivelAux is EnergDispAt - Energia,
                                    ((EnergDispAt is (0.8*CargaTotalBaterias),
                                    EnergiaDisponivelAux<(0.2*CargaTotalBaterias),
                                    EnergiaDisponivel is (0.2*CargaTotalBaterias),!,
                                    TempoExtra is TempAdicional);(EnergiaDisponivel is EnergiaDisponivelAux, TempoExtra is 0)),
                                    dadosCam_t_e_ta(_, Id2, Id3, _, EnergiaMax2, _),
                                    PesoTotal2 is Tara+PesoAt2,
                                    EnergiaSeguinte is EnergiaMax2*PesoTotal2/PesoMax,
                                    cidadeArmazem(ArmPrincipal),
                                    ((Id3 == ArmPrincipal,
                                    EnergiaDisponivel-EnergiaSeguinte<(0.2*CargaTotalBaterias),!,
                                    EnergDispAt1 is (0.2*CargaTotalBaterias)+EnergiaSeguinte,
                                    TempoCarga is ((0.2*CargaTotalBaterias)-(EnergiaDisponivel-EnergiaSeguinte))*60/(0.6*CargaTotalBaterias),
                                    (((TempoCarga > TempoRet),!, TempoEspera is TempoCarga);(TempoEspera is TempoRet)));(

                                    ((EnergiaDisponivel-EnergiaSeguinte<(0.2*CargaTotalBaterias),!,
                                    TempoCarga is ((0.8*CargaTotalBaterias)-EnergiaDisponivel)*60/(0.6*CargaTotalBaterias),
                                    EnergDispAt1 is 0.8*CargaTotalBaterias,
                                    (((TempoCarga > TempoRet),!, TempoEspera is TempoCarga);(TempoEspera is TempoRet)));(TempoEspera is TempoRet,EnergDispAt1 is EnergiaDisponivel)))),
                                    tempo([Id2,Id3|LCompleto],[PesoAt2|LP], EnergDispAt1, Tempo1, Data, C),
                                    Tempo is Tempo1+TempoAtual+TempoEspera+TempoExtra.



traj_mais_rapida(L,Tempo, Data, C, TSol):-get_time(Ti),
                                   (run(Data, C);true),tempo_min(L,Tempo),
                                   get_time(Tf), TSol is Tf-Ti.

run(Data, C):- retractall(tempo_min(_,_)), assertz(tempo_min(_,1000000)),
        findall(Id, entrega(_,_,_,Id,_,_),LF),
        permutation(LF,LFPerm),
        calcula_tempo(LFPerm,Tempo, Data, C),
        atualiza(LFPerm,Tempo),
        fail.

atualiza(LFPerm,Tempo):-
        tempo_min(_,TempoMin),
        ((Tempo<TempoMin,!,retract(tempo_min(_,_)),assertz(tempo_min(LFPerm,Tempo));(true))).



% ----------------------------: HEURISTICA DO ARMAZEM MAIS PRÓXIMO :-------------------------- %

heuristica_armazem(Data, Camiao, Trajetoria, Tempo):-obter_armazens_ids(Data,LArmazens),
                                                        cidadeArmazem(Orig),
                                                        bfs_armazem(Orig,LArmazens,Trajetoria),
                                                        calcula_tempo(Trajetoria, Tempo, Data, Camiao), !.

bfs_armazem(_,[],[]):-!.

bfs_armazem(Orig,[ArmAct|LArmazens],[ArmazemMaisProx|Trajetoria]):-armazem_mais_prox(Orig,[ArmAct|LArmazens],_,ArmazemMaisProx),
                                                                              delete([ArmAct|LArmazens],ArmazemMaisProx,LArmazensAtual),
                                                                              bfs_armazem(ArmazemMaisProx,LArmazensAtual,Trajetoria).


obter_armazens_ids(Data,LA):-findall(Id, entrega(_,Data,_,Id,_,_),LA).

lista_tempo_armazem(_,[],[]).
lista_tempo_armazem(Act,[Id|LArmazens],[(Tempo,Id)|LF]):- dadosCam_t_e_ta(_,Act,Id,Tempo,_,_),
                                                        lista_tempo_armazem(Act,LArmazens,LF).


armazem_mais_prox(Act,LArmazens,TempoMin, Armazem):-lista_tempo_armazem(Act,LArmazens, LF),
                                                sort(LF, LFOrd),
                                                LFOrd = [(TempoMin,Armazem)|_].




% ----------------------------: HEURISTICA DA ENTREGA COM MAIOR MASSA :-------------------------- %

heuristicaEntrega(Data, Camiao, Trajetoria, Tempo):-obter_armazens_ids(Data, LEntregas),
                                                        cidadeArmazem(Origem),
                                                        bfsEntrega(Origem,LEntregas,Data,Trajetoria),
                                                        calcula_tempo(Trajetoria, Tempo, Data, Camiao).

bfsEntrega(_,[],_,[]):-!.

bfsEntrega(Origem,[EntregaAtual|LEntregas],Data,[ArmEntregaMaiorMassa|Trajetoria]):-entregaMaiorMassa(Origem,[EntregaAtual|LEntregas],Data,_,ArmEntregaMaiorMassa),
                                                                                delete([EntregaAtual|LEntregas],ArmEntregaMaiorMassa,LEntregasAtual),
                                                                                bfsEntrega(ArmEntregaMaiorMassa,LEntregasAtual,Data,Trajetoria).

listaMassaEntrega(_,[],_,[]).

listaMassaEntrega(Act,[Id|LArmazens],Data,[(Massa,Id)|LTME]):-entrega(_,Data,Massa,Id,_,_),
                                                        listaMassaEntrega(Act,LArmazens,Data,LTME).

entregaMaiorMassa(EntregaAtual,LEntregas,Data,MaiorMassa,Armazem):-listaMassaEntrega(EntregaAtual,LEntregas,Data,LME),
                                                                sort(0,@>=,LME,LMEOrd),
                                                                LMEOrd = [(MaiorMassa,Armazem)|_].


% ----------------------------: HEURISTICA MELHOR RELACAO TEMPO E MASSA :-------------------------- %


heuristica_tempo_massa(Data, Camiao, Trajetoria, Tempo):-obter_armazens_ids(Data,LArmazens),
                                                        cidadeArmazem(Orig),
                                                        bfs_tempo_massa(Orig,LArmazens,Data,Trajetoria),
                                                        calcula_tempo(Trajetoria, Tempo, Data, Camiao).

bfs_tempo_massa(_,[],_,[]):-!.

bfs_tempo_massa(Orig,[ArmAct|LArmazens],Data,[MelhorArmazem|Trajetoria]):-melhor_relacao(Orig,[ArmAct|LArmazens],Data,_,MelhorArmazem),
                                                                              delete([ArmAct|LArmazens],MelhorArmazem,LArmazensAtual),
                                                                              bfs_tempo_massa(MelhorArmazem,LArmazensAtual,Data,Trajetoria).

lista_tempo_massa(_,[],_,[]).
lista_tempo_massa(Act,[Id|LArmazens],Data,[(Relacao,Id)|LF]):- dadosCam_t_e_ta(_,Act,Id,Tempo,_,_),
                                                        entrega(_, Data, Massa, Id, _, _),
                                                        Relacao is Massa/Tempo,
                                                        lista_tempo_massa(Act,LArmazens,Data,LF).

melhor_relacao(Act,LArmazens,Data,MelhorRelacao,Armazem):-lista_tempo_massa(Act,LArmazens,Data,LF),
                                                sort(0,@>=,LF,LFOrd),
                                                LFOrd = [(MelhorRelacao,Armazem)|_].


% ----------------------------: ALGORITMO GENÉTICO :-------------------------- %

:-dynamic geracoes/1.
:-dynamic populacao/1.
:-dynamic prob_cruzamento/1.
:-dynamic prob_mutacao/1.
:-dynamic entregas/1.




% parameteriza��o
inicializaARQSI(NG,DP,P1,P2):-	(retract(geracoes(_));true), asserta(geracoes(NG)),
	(retract(populacao(_));true), asserta(populacao(DP)),
	PC is P1/100,
	(retract(prob_cruzamento(_));true),	asserta(prob_cruzamento(PC)),
	PM is P2/100,
	(retract(prob_mutacao(_));true), asserta(prob_mutacao(PM)).


geraARQSI(Data, Camiao, MelhorPlaneamento,Tempo, NG, DP, P1, P2, TMax, LimEstabilizacao):-
	inicializaARQSI(NG,DP,P1,P2),
	gera_populacao(Pop, Data, Camiao),
	write('Pop='),write(Pop),nl,
	avalia_populacao(Pop,PopAv,Data,Camiao),
	write('PopAv='),write(PopAv),nl,
	ordena_populacao(PopAv,PopOrd),
	geracoes(NG),
	get_time(Ti),
	gera_geracao(0,NG,PopOrd,0,LimEstabilizacao,Ti,TMax,0,Data,Camiao,MelhorPlaneamento*Tempo).

% parameteriza��o
inicializaALGAV:-write('Numero de novas Geracoes: '),read(NG), 			(retract(geracoes(_));true), asserta(geracoes(NG)),
	write('Dimensao da Populacao: '),read(DP),
	(retract(populacao(_));true), asserta(populacao(DP)),
	write('Probabilidade de Cruzamento (%):'), read(P1),
	PC is P1/100, 
	(retract(prob_cruzamento(_));true), 	asserta(prob_cruzamento(PC)),
	write('Probabilidade de Mutacao (%):'), read(P2),
	PM is P2/100, 
	(retract(prob_mutacao(_));true), asserta(prob_mutacao(PM)).

geraALGAV(Data, Camiao, MelhorPlaneamento,Tempo, TMax, LimEstabilizacao):-
	inicializaALGAV,
	gera_populacao(Pop, Data, Camiao),
	write('Pop='),write(Pop),nl,
	avalia_populacao(Pop,PopAv,Data,Camiao),
	write('PopAv='),write(PopAv),nl,
	ordena_populacao(PopAv,PopOrd),
	geracoes(NG),
	get_time(Ti),
	gera_geracao(0,NG,PopOrd,0,LimEstabilizacao,Ti,TMax,0,Data,Camiao,MelhorPlaneamento*Tempo).


gera_populacao(Pop, Data, Camiao):-
	populacao(TamPop),
	findall(Entrega, entrega(_,Data,_,Entrega,_,_),ListaEntregas),
	length(ListaEntregas, NumE),
	(retract(entregas(_));true),	asserta(entregas(NumE)),
	gera_populacao(TamPop,ListaEntregas,NumE,Pop, Data, Camiao).


gera_populacao(0,_,_,[],Data,Camiao):-!.

gera_populacao(TamPop,ListaEntregas,NumE,[Ind|Resto],Data,Camiao):-
	TamPop1 is TamPop-1,
	gera_populacao(TamPop1,ListaEntregas,NumE,Resto,Data,Camiao),
	((TamPop1 is 0, !, heuristica_armazem(Data, Camiao, Ind, _));((TamPop1 is 1, !, obter_segundo_individuo(Resto,Data,Camiao,Ind)));
	(gera_individuo(ListaEntregas,NumE,Ind))),
	not(member(Ind,Resto)).
gera_populacao(TamPop,ListaEntregas,NumE,L,Data,Camiao):-
	gera_populacao(TamPop,ListaEntregas,NumE,L,Data,Camiao).



obter_segundo_individuo([PrimeiroInd|Resto], Data, Camiao, Ind):-
	heuristica_tempo_massa(Data, Camiao, AuxInd, _),
	((AuxInd == PrimeiroInd, !, heuristicaEntrega(Data, Camiao, Ind, _));(Ind = AuxInd)).


gera_individuo([G],1,[G]):-!.

gera_individuo(ListaEntregas,NumE,[G|Resto]):-
	NumTemp is NumE + 1, % To use with random
	random(1,NumTemp,N),
	retira(N,ListaEntregas,G,NovaLista),
	NumT1 is NumE-1,
	gera_individuo(NovaLista,NumT1,Resto).


retira(1,[G|Resto],G,Resto):-!.
retira(N,[G1|Resto],G,[G1|Resto1]):-
	N1 is N-1,
	retira(N1,Resto,G,Resto1).

avalia_populacao([],[],_,_):-!.
avalia_populacao([Ind|Resto],[Ind*V|Resto1],Data,Camiao):-
	calcula_tempo(Ind,V, Data, Camiao),
	avalia_populacao(Resto,Resto1,Data,Camiao).

ordena_populacao(PopAv,PopAvOrd):-
	bsort(PopAv,PopAvOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
	bsort(Xs,Zs),
	btroca([X|Zs],Ys).


btroca([X],[X]):-!.

btroca([X*VX,Y*VY|L1],[Y*VY|L2]):-
	VX>VY,!,
	btroca([X*VX|L1],L2).

btroca([X|L1],[X|L2]):-btroca(L1,L2).


gera_geracao(G,G,Pop,_,_,_,_,_,_,_,MelhorPlaneamento):-!,
	write('Geracao '), write(G), write(':'), nl, write(Pop), nl,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao(G,_,Pop,LimEstabilizacao,LimEstabilizacao,_,_,_,_,_,MelhorPlaneamento):-!,
	write('Geracao '), write(G), write(':'), nl, write(Pop), nl,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao(G,_,Pop,_,_,_,_,1,_,_,MelhorPlaneamento):-!,
	write('Geracao '), write(G), write(':'), nl, write(Pop), nl,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao(N,G,Pop,Cont,LimEstabilizacao,Ti,TMax,_,Data,Camiao,MelhorPlaneamento):-
	write('Geracao '), write(N), write(':'), nl, write(Pop), nl,
	random_permutation(Pop,RandomPop),
	cruzamento(RandomPop,NPop1),
	mutacao(NPop1,NPop),
	avalia_populacao(NPop,NPopAv,Data,Camiao),
	append(Pop, NPopAv, JuncaoPop),
	sort(JuncaoPop, NoDuplicates),
	ordena_populacao(NoDuplicates, NoDuplicatesOrd),
	Perc is 30/100,
	populacao(TamPop),
	P is round(Perc*TamPop),
	retirarPMelhores(NoDuplicatesOrd,P,ListaPMelhores,ListaRestantes),
	produtoListaRestantes(ListaRestantes,ListaProdutoRestantes),
	sort(0,@=<,ListaProdutoRestantes,ListaProdutoRestantesOrd),
	organizarListaProduto(ListaProdutoRestantesOrd,ListaProdutoRestantesOrg),
	PrimeirosElementos is TamPop-P,
	retirarNPElementos(ListaProdutoRestantesOrg,PrimeirosElementos,ListaNPMelhores),
	append(ListaPMelhores,ListaNPMelhores,ProxGeracao),
	verificarEstabilizacao(Pop,ProxGeracao,Cont,ContAtualizado),
	N1 is N+1,
	get_time(Tf),
	TSol is Tf-Ti,
	verificarTempoLimite(TSol,TMax,FlagMax),
	gera_geracao(N1,G,ProxGeracao,ContAtualizado,LimEstabilizacao,Ti,TMax,FlagMax,Data,Camiao,MelhorPlaneamento).


% Retira os P Melhores e retorna uma nova lista ListaRestantes com os T-P elementos

retirarPMelhores([H|NoDuplicatesOrd], 0, [],[H|NoDuplicatesOrd]):-!.
retirarPMelhores([Ind|NoDuplicatesOrd],P,[Ind|ListaMelhores],ListaRestantes):-
	P1 is P-1,
	retirarPMelhores(NoDuplicatesOrd,P1,ListaMelhores,ListaRestantes).


produtoListaRestantes([],[]):-!.
produtoListaRestantes([Ind*Tempo|ListaRestantes],[(Produto,Ind*Tempo)|ListaProduto]):-produtoListaRestantes(ListaRestantes,ListaProduto), random(0.0,1.0,NumAleatorio), Produto is NumAleatorio * Tempo.

organizarListaProduto([],[]):-!.
organizarListaProduto([(_,Ind*Tempo)|ListaProduto],[Ind*Tempo|ListaFinalProduto]):-organizarListaProduto(ListaProduto,ListaFinalProduto).


retirarNPElementos([_|_], 0, []):-!.
retirarNPElementos([Ind|ListaProdutoRestantesOrd],NP,[Ind|ListaNPMelhores]):-
	NP1 is NP-1,
	retirarNPElementos(ListaProdutoRestantesOrd,NP1,ListaNPMelhores).

verificarEstabilizacao(Pop,ProxGeracao,Cont,ContAtualizado):-((verificarListasIguais(Pop,ProxGeracao), !, ContAtualizado is Cont+1);(ContAtualizado is 0)).

verificarListasIguais([],[]):-!.
verificarListasIguais([Ind1|Pop],[Ind2|ProxGeracao]):-Ind1=Ind2, verificarListasIguais(Pop,ProxGeracao).

verificarTempoLimite(TSol,TMax,FlagMax):-((TSol > TMax,!,FlagMax is 1);(FlagMax is 0)).

obterMelhorPlaneamento(Pop,MelhorPlaneamento):-ordena_populacao(Pop,PopOrd),PopOrd = [MelhorPlaneamento|_].

gerar_pontos_cruzamento(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).

gerar_pontos_cruzamento1(P1,P2):-
	entregas(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);(P1=P21,P2=P11)).
gerar_pontos_cruzamento1(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).


cruzamento([],[]).
cruzamento([Ind*_],[Ind]).
cruzamento([Ind1*_,Ind2*_|Resto],[NInd1,NInd2|Resto1]):-
	gerar_pontos_cruzamento(P1,P2),
	prob_cruzamento(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cruzar(Ind1,Ind2,P1,P2,NInd1),
	  cruzar(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	cruzamento(Resto,Resto1).

preencheh([],[]).

preencheh([_|R1],[h|R2]):-
	preencheh(R1,R2).


sublista(L1,I1,I2,L):-
	I1 < I2,!,
	sublista1(L1,I1,I2,L).

sublista(L1,I1,I2,L):-
	sublista1(L1,I2,I1,L).

sublista1([X|R1],1,1,[X|H]):-!,
	preencheh(R1,H).

sublista1([X|R1],1,N2,[X|R2]):-!,
	N3 is N2 - 1,
	sublista1(R1,1,N3,R2).

sublista1([_|R1],N1,N2,[h|R2]):-
	N3 is N1 - 1,
	N4 is N2 - 1,
	sublista1(R1,N3,N4,R2).

rotate_right(L,K,L1):-
	entregas(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):-
	N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).


elimina([],_,[]):-!.

elimina([X|R1],L,[X|R2]):-
	not(member(X,L)),!,
	elimina(R1,L,R2).

elimina([_|R1],L,R2):-
	elimina(R1,L,R2).

insere([],L,_,L):-!.
insere([X|R],L,N,L2):-
	entregas(T),
	((N>T,!,N1 is N mod T);N1 = N),
	insere1(X,N1,L,L1),
	N2 is N + 1,
	insere(R,L1,N2,L2).


insere1(X,1,L,[X|L]):-!.
insere1(X,N,[Y|L],[Y|L1]):-
	N1 is N-1,
	insere1(X,N1,L,L1).

cruzar(Ind1,Ind2,P1,P2,NInd11):-
	sublista(Ind1,P1,P2,Sub1),
	entregas(NumE),
	R is NumE-P2,
	rotate_right(Ind2,R,Ind21),
	elimina(Ind21,Sub1,Sub2),
	P3 is P2 + 1,
	insere(Sub2,Sub1,P3,NInd1),
	eliminah(NInd1,NInd11).


eliminah([],[]).

eliminah([h|R1],R2):-!,
	eliminah(R1,R2).

eliminah([X|R1],[X|R2]):-
	eliminah(R1,R2).

mutacao([],[]).
mutacao([Ind|Rest],[NInd|Rest1]):-
	prob_mutacao(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutacao(Rest,Rest1).

mutacao1(Ind,NInd):-
	gerar_pontos_cruzamento(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).


% ----------------------------: Atrbuição de Entregas a 3 camiões :-------------------------- %                                                     
reverse([],Z,Z).
reverse([H|T],Z,Acc) :- reverse(T,Z,[H|Acc]).

geraARQSI2(Data, Camiao,MelhorPlaneamento,Tempo,EntregasDivididas, NG, DP, P1, P2, TMax, LimEstabilizacao):-
	inicializaARQSI(NG,DP,P1,P2),
	carateristicasCam(eTruck01,_,CargaCamiao,_,_,_),
	camioes_necessarios(CargaCamiao,NumCamioes,EntregasDivididas,Data),
	gera_populacao(Pop, Data, Camiao),
	valida_populacao(Pop,NumCamioes,EntregasDivididas,PopTemp,PopVal),
	NumCamioesInteiro is truncate(NumCamioes),
	avalia_populacao2(PopVal,PopAv,Data,Camiao,NumCamioesInteiro,EntregasDivididas),
	ordena_populacao(PopAv,PopOrd),
	geracoes(NG),
	get_time(Ti),
	gera_geracao2(0,NG,PopOrd,0,LimEstabilizacao,Ti,TMax,0,Data,Camiao,MelhorPlaneamento*Tempo,NumCamioes,EntregasDivididas).


gera_populacao2(Pop, Data, Camiao, ListaEntregas):-
	populacao(TamPop),
	length(ListaEntregas, NumE),
	(retract(entregas(_));true),	asserta(entregas(NumE)),
	gera_populacao2(TamPop,ListaEntregas,NumE,Pop, Data, Camiao).

gera_populacao2(0,_,_,[],Data,Camiao):-!.
gera_populacao2(TamPop,ListaEntregas,NumE,[Ind|Resto],Data,Camiao):-
	TamPop1 is TamPop-1,
	gera_populacao2(TamPop1,ListaEntregas,NumE,Resto,Data,Camiao),
	((TamPop1 is 0, !, heuristica_armazem(Data, Camiao, Ind, _));((TamPop1 is 1, !, obter_segundo_individuo(Resto,Data,Camiao,Ind)));
	(gera_individuo(ListaEntregas,NumE,Ind))),
	not(member(Ind,Resto)).
gera_populacao2(TamPop,ListaEntregas,NumE,L,Data,Camiao):-
	gera_populacao2(TamPop,ListaEntregas,NumE,L,Data,Camiao).


avaliar_tempos(_,Tempo,NumCamioes,NumCamioes,_,_,_,MaiorTempo):-
	MaiorTempo = Tempo,!.
avaliar_tempos(H,Tempo,NumAval,NumCamioes,EntregasDivididas,Data,Camiao,MaiorTempo):-
	((NumAval < NumCamioes, entregas_por_camiao(EntregasDivididas,H,EntregasCamiao),
		calcula_tempo(EntregasCamiao, TempoTemp,Data,Camiao));
	(calcula_tempo(H, TempoTemp,Data,Camiao))),
	((TempoTemp > Tempo, TempoFinal is TempoTemp);(TempoFinal is Tempo)),
	limpar_lista(H,EntregasCamiao,ListaLimpa),
	NumAval1 is NumAval+1,
	avaliar_tempos(ListaLimpa,TempoFinal,NumAval1,NumCamioes,EntregasDivididas,Data,Camiao,MaiorTempo).	


avalia_populacao2([],[],_,_,_,_).
avalia_populacao2([H|T],[H*V|T1],Data,Camiao,NumCamioes,EntregasDivididas):-
	avaliar_tempos(H,0,1,NumCamioes,EntregasDivididas,Data,Camiao,V),
	avalia_populacao2(T,T1,Data,Camiao,NumCamioes,EntregasDivididas).


valida_populacao([],_,_,PopVal,PopFinal):-PopFinal=PopVal,!.
valida_populacao([H|T],NumCamioes,EntregasDivididas,PopVal1,PopVal):-
	avalia_H(H,1,NumCamioes,EntregasDivididas,0,HVal),
	((HVal==0, append(PopVal1,[H],NewPop),valida_populacao(T,NumCamioes,EntregasDivididas,NewPop,PopVal))
	;(random_permutation(H,HNovo), append(T,[HNovo],T1),valida_populacao(T1,NumCamioes,EntregasDivididas,PopVal1,PopVal))).


avalia_H(_,_,_,_,1,HVal):-
					HVal is 1,!.
avalia_H(_,_,_,_,2,HVal):-
					HVal is 0,!.

avalia_H(H,NumAval,NumCamioes,EntregasDivididas,FimFlag,HVal):-
	((NumAval < NumCamioes, entregas_por_camiao(EntregasDivididas,H,EntregasCamiao),
		soma_massas20(EntregasCamiao,MassaTotalCamiao),TempFlag is 0)
	;(soma_massas20(H,MassaTotalCamiao),TempFlag is 2)),
	((MassaTotalCamiao < 4300, NumAval1 is NumAval+1,limpar_lista(H,EntregasCamiao,ListaLimpa),
		avalia_H(ListaLimpa,NumAval1,NumCamioes,EntregasDivididas,TempFlag,HVal))
	;(avalia_H(_,NumCamioes,NumCamioes,_,1,HVal))).	


limpar_lista([],_,[]).
limpar_lista([R|Z],EntregasCamiao,ListaLimpa):-member(R,EntregasCamiao),!,limpar_lista(Z,EntregasCamiao,ListaLimpa).
limpar_lista([R|Z],EntregasCamiao,[R|ListaLimpa]):-limpar_lista(Z,EntregasCamiao,ListaLimpa).


soma_massas20(IdArmazens,TotalCarga):-
					soma_massas21(IdArmazens,ListaMassas),
					soma_massas(ListaMassas,TotalCarga,X).
soma_massas21([],[]).
soma_massas21([ID|IDResto],[Massa|ListaMassa]):-
					soma_massas21(IDResto,ListaMassa),
					entrega(_,_,Massa,ID,_,_).


entregas_por_camiao(0.0,_,[]).
entregas_por_camiao(EntregasDivididas,[E1|EResto],[E1|RFinal]):-
					EntregasDivididas1 is EntregasDivididas-1,
					entregas_por_camiao(EntregasDivididas1,EResto,RFinal).	 


camioes_necessarios(CargaCamiao,NumCamioes, EntregasPorCamiao,Data):- 
	findall(Massa,entrega(_, Data, Massa, _, _, _), TotalMassas),
	soma_massas(TotalMassas, QMassas, NumE),
	CargaPorCamiao is QMassas/CargaCamiao,
	verificar_num_camioes(CargaPorCamiao,NumCamioes),
	EntregasPorCamiao is float_integer_part(NumE/NumCamioes).


verificar_num_camioes(CargaPorCamiao,NumCamioes):-
							CurrentNumCamiao is float_integer_part(CargaPorCamiao),
							((float_fractional_part(CargaPorCamiao) < 0.8, !,NumCamioes is CurrentNumCamiao+1);(NumCamioes is CurrentNumCamiao+2)).	


soma_massas([],0,0).
soma_massas([H|T], SomaMassas,NumE):- 
							soma_massas(T, SomaMassas1,NumE1),
							NumE is NumE1+1,
							SomaMassas is H+SomaMassas1.

/*obterMelhorPlaneamento2(Pop,MelhorPlaneamento):-ordena_populacao(Pop,PopOrd),reverse(PopOrd,NewPopOrd,[]),NewPopOrd = [MelhorPlaneamento|_].*/

gera_geracao2(G,G,Pop,_,_,_,_,_,_,_,MelhorPlaneamento,_,_):-!,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao2(G,_,Pop,LimEstabilizacao,LimEstabilizacao,_,_,_,_,_,MelhorPlaneamento,_,_):-!,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao2(G,_,Pop,_,_,_,_,1,_,_,MelhorPlaneamento,_,_):-!,
	obterMelhorPlaneamento(Pop,MelhorPlaneamento).

gera_geracao2(N,G,Pop,Cont,LimEstabilizacao,Ti,TMax,_,Data,Camiao,MelhorPlaneamento,NumCamioes,EntregasDivididas):-
	random_permutation(Pop,RandomPop),
	cruzamento(RandomPop,NPop1),
	mutacao(NPop1,NPop),
	valida_populacao(NPop,NumCamioes,EntregasDivididas,PopTemp,PopVal),
	NumCamioesInteiro is truncate(NumCamioes),
	avalia_populacao2(PopVal,NPopAv,Data,Camiao,NumCamioesInteiro,EntregasDivididas),
	append(Pop, NPopAv, JuncaoPop),
	sort(JuncaoPop, NoDuplicates),
	ordena_populacao(NoDuplicates, NoDuplicatesOrd),
	Perc is 30/100,
	populacao(TamPop),
	P is round(Perc*TamPop),
	retirarPMelhores(NoDuplicatesOrd,P,ListaPMelhores,ListaRestantes),
	produtoListaRestantes(ListaRestantes,ListaProdutoRestantes),
	sort(0,@=<,ListaProdutoRestantes,ListaProdutoRestantesOrd),
	organizarListaProduto(ListaProdutoRestantesOrd,ListaProdutoRestantesOrg),
	PrimeirosElementos is TamPop-P,
	retirarNPElementos(ListaProdutoRestantesOrg,PrimeirosElementos,ListaNPMelhores),
	append(ListaPMelhores,ListaNPMelhores,ProxGeracao),
	verificarEstabilizacao(Pop,ProxGeracao,Cont,ContAtualizado),
	N1 is N+1,
	get_time(Tf),
	TSol is Tf-Ti,
	verificarTempoLimite(TSol,TMax,FlagMax),
	gera_geracao2(N1,G,ProxGeracao,ContAtualizado,LimEstabilizacao,Ti,TMax,FlagMax,Data,Camiao,MelhorPlaneamento,NumCamioes,EntregasDivididas).



% --------------------------------------------------------------------------------------------------------: PREDICADOS :-----------------------------------------------------------------------------------------------------.




%dadosCam_t_e_ta(<nome_camiao>,<cidade_origem>,<cidade_destino>,<tempo>,<energia>,<tempo_adicional>).
dadosCam_t_e_ta(eTruck01,"1","2",122,42,0).
dadosCam_t_e_ta(eTruck01,"1","3",122,46,0).
dadosCam_t_e_ta(eTruck01,"1","4",151,54,25).
dadosCam_t_e_ta(eTruck01,"1","5",147,52,25).
dadosCam_t_e_ta(eTruck01,"1","6",74,24,0).
dadosCam_t_e_ta(eTruck01,"1","7",116,35,0).
dadosCam_t_e_ta(eTruck01,"1","8",141,46,0).
dadosCam_t_e_ta(eTruck01,"1","9",185,74,53).
dadosCam_t_e_ta(eTruck01,"1","10",97,30,0).
dadosCam_t_e_ta(eTruck01,"1","11",164,64,40).
dadosCam_t_e_ta(eTruck01,"1","12",76,23,0).
dadosCam_t_e_ta(eTruck01,"1","13",174,66,45).
dadosCam_t_e_ta(eTruck01,"1","14",59,18,0).
dadosCam_t_e_ta(eTruck01,"1","15",132,51,24).
dadosCam_t_e_ta(eTruck01,"1","16",181,68,45).
dadosCam_t_e_ta(eTruck01,"1","17",128,45,0).

dadosCam_t_e_ta(eTruck01,"2","1",116,42,0).
dadosCam_t_e_ta(eTruck01,"2","3",55,22,0).
dadosCam_t_e_ta(eTruck01,"2","4",74,25,0).
dadosCam_t_e_ta(eTruck01,"2","5",65,22,0).
dadosCam_t_e_ta(eTruck01,"2","6",69,27,0).
dadosCam_t_e_ta(eTruck01,"2","7",74,38,0).
dadosCam_t_e_ta(eTruck01,"2","8",61,18,0).
dadosCam_t_e_ta(eTruck01,"2","9",103,44,0).
dadosCam_t_e_ta(eTruck01,"2","10",36,14,0).
dadosCam_t_e_ta(eTruck01,"2","11",88,41,0).
dadosCam_t_e_ta(eTruck01,"2","12",61,19,0).
dadosCam_t_e_ta(eTruck01,"2","13",95,42,0).
dadosCam_t_e_ta(eTruck01,"2","14",78,34,0).
dadosCam_t_e_ta(eTruck01,"2","15",69,30,0).
dadosCam_t_e_ta(eTruck01,"2","16",99,38,0).
dadosCam_t_e_ta(eTruck01,"2","17",46,14,0).

dadosCam_t_e_ta(eTruck01,"3","1",120,45,0).
dadosCam_t_e_ta(eTruck01,"3","2",50,22,0).
dadosCam_t_e_ta(eTruck01,"3","4",46,15,0).
dadosCam_t_e_ta(eTruck01,"3","5",46,14,0).
dadosCam_t_e_ta(eTruck01,"3","6",74,37,0).
dadosCam_t_e_ta(eTruck01,"3","7",63,23,0).
dadosCam_t_e_ta(eTruck01,"3","8",38,8,0).
dadosCam_t_e_ta(eTruck01,"3","9",84,36,0).
dadosCam_t_e_ta(eTruck01,"3","10",59,28,0).
dadosCam_t_e_ta(eTruck01,"3","11",61,27,0).
dadosCam_t_e_ta(eTruck01,"3","12",67,32,0).
dadosCam_t_e_ta(eTruck01,"3","13",67,29,0).
dadosCam_t_e_ta(eTruck01,"3","14",82,38,0).
dadosCam_t_e_ta(eTruck01,"3","15",34,8,0).
dadosCam_t_e_ta(eTruck01,"3","16",80,30,0).
dadosCam_t_e_ta(eTruck01,"3","17",36,10,0).

dadosCam_t_e_ta(eTruck01,"4","1",149,54,25).
dadosCam_t_e_ta(eTruck01,"4","2",65,24,0).
dadosCam_t_e_ta(eTruck01,"4","3",46,16,0).
dadosCam_t_e_ta(eTruck01,"4","5",27,10,0).
dadosCam_t_e_ta(eTruck01,"4","6",103,47,0).
dadosCam_t_e_ta(eTruck01,"4","7",55,27,0).
dadosCam_t_e_ta(eTruck01,"4","8",36,10,0).
dadosCam_t_e_ta(eTruck01,"4","9",50,26,0).
dadosCam_t_e_ta(eTruck01,"4","10",78,34,0).
dadosCam_t_e_ta(eTruck01,"4","11",42,19,0).
dadosCam_t_e_ta(eTruck01,"4","12",97,42,0).
dadosCam_t_e_ta(eTruck01,"4","13",44,11,0).
dadosCam_t_e_ta(eTruck01,"4","14",111,48,0).
dadosCam_t_e_ta(eTruck01,"4","15",32,13,0).
dadosCam_t_e_ta(eTruck01,"4","16",53,14,0).
dadosCam_t_e_ta(eTruck01,"4","17",38,11,0).

dadosCam_t_e_ta(eTruck01,"5","1",141,51,24).
dadosCam_t_e_ta(eTruck01,"5","2",55,20,0).
dadosCam_t_e_ta(eTruck01,"5","3",48,14,0).
dadosCam_t_e_ta(eTruck01,"5","4",25,9,0).
dadosCam_t_e_ta(eTruck01,"5","6",97,44,0).
dadosCam_t_e_ta(eTruck01,"5","7",55,28,0).
dadosCam_t_e_ta(eTruck01,"5","8",29,7,0).
dadosCam_t_e_ta(eTruck01,"5","9",48,24,0).
dadosCam_t_e_ta(eTruck01,"5","10",69,30,0).
dadosCam_t_e_ta(eTruck01,"5","11",53,26,0).
dadosCam_t_e_ta(eTruck01,"5","12",95,36,0).
dadosCam_t_e_ta(eTruck01,"5","13",63,20,0).
dadosCam_t_e_ta(eTruck01,"5","14",105,45,0).
dadosCam_t_e_ta(eTruck01,"5","15",34,14,0).
dadosCam_t_e_ta(eTruck01,"5","16",46,18,0).
dadosCam_t_e_ta(eTruck01,"5","17",27,7,0).

dadosCam_t_e_ta(eTruck01,"6","1",69,23,0).
dadosCam_t_e_ta(eTruck01,"6","2",71,27,0).
dadosCam_t_e_ta(eTruck01,"6","3",74,38,0).
dadosCam_t_e_ta(eTruck01,"6","4",103,46,0).
dadosCam_t_e_ta(eTruck01,"6","5",99,44,0).
dadosCam_t_e_ta(eTruck01,"6","7",88,48,0).
dadosCam_t_e_ta(eTruck01,"6","8",92,38,0).
dadosCam_t_e_ta(eTruck01,"6","9",134,66,45).
dadosCam_t_e_ta(eTruck01,"6","10",42,14,0).
dadosCam_t_e_ta(eTruck01,"6","11",116,56,30).
dadosCam_t_e_ta(eTruck01,"6","12",23,9,0).
dadosCam_t_e_ta(eTruck01,"6","13",126,58,33).
dadosCam_t_e_ta(eTruck01,"6","14",25,9,0).
dadosCam_t_e_ta(eTruck01,"6","15",84,44,0).
dadosCam_t_e_ta(eTruck01,"6","16",132,60,35).
dadosCam_t_e_ta(eTruck01,"6","17",80,38,0).

dadosCam_t_e_ta(eTruck01,"7","1",116,36,0).
dadosCam_t_e_ta(eTruck01,"7","2",71,38,0).
dadosCam_t_e_ta(eTruck01,"7","3",61,22,0).
dadosCam_t_e_ta(eTruck01,"7","4",53,26,0).
dadosCam_t_e_ta(eTruck01,"7","5",53,28,0).
dadosCam_t_e_ta(eTruck01,"7","6",88,48,0).
dadosCam_t_e_ta(eTruck01,"7","8",59,26,0).
dadosCam_t_e_ta(eTruck01,"7","9",88,48,0).
dadosCam_t_e_ta(eTruck01,"7","10",84,44,0).
dadosCam_t_e_ta(eTruck01,"7","11",74,22,0).
dadosCam_t_e_ta(eTruck01,"7","12",82,42,0).
dadosCam_t_e_ta(eTruck01,"7","13",76,31,0).
dadosCam_t_e_ta(eTruck01,"7","14",97,49,21).
dadosCam_t_e_ta(eTruck01,"7","15",29,16,0).
dadosCam_t_e_ta(eTruck01,"7","16",84,42,0).
dadosCam_t_e_ta(eTruck01,"7","17",69,30,0).

dadosCam_t_e_ta(eTruck01,"8","1",134,46,0).
dadosCam_t_e_ta(eTruck01,"8","2",59,18,0).
dadosCam_t_e_ta(eTruck01,"8","3",32,6,0).
dadosCam_t_e_ta(eTruck01,"8","4",34,10,0).
dadosCam_t_e_ta(eTruck01,"8","5",32,7,0).
dadosCam_t_e_ta(eTruck01,"8","6",88,38,0).
dadosCam_t_e_ta(eTruck01,"8","7",57,26,0).
dadosCam_t_e_ta(eTruck01,"8","9",69,30,0).
dadosCam_t_e_ta(eTruck01,"8","10",65,26,0).
dadosCam_t_e_ta(eTruck01,"8","11",53,22,0).
dadosCam_t_e_ta(eTruck01,"8","12",82,34,0).
dadosCam_t_e_ta(eTruck01,"8","13",61,24,0).
dadosCam_t_e_ta(eTruck01,"8","14",97,40,0).
dadosCam_t_e_ta(eTruck01,"8","15",36,12,0).
dadosCam_t_e_ta(eTruck01,"8","16",65,23,0).
dadosCam_t_e_ta(eTruck01,"8","17",32,6,0).

dadosCam_t_e_ta(eTruck01,"9","1",181,72,50).
dadosCam_t_e_ta(eTruck01,"9","2",95,41,0).
dadosCam_t_e_ta(eTruck01,"9","3",86,35,0).
dadosCam_t_e_ta(eTruck01,"9","4",55,24,0).
dadosCam_t_e_ta(eTruck01,"9","5",48,23,0).
dadosCam_t_e_ta(eTruck01,"9","6",134,65,42).
dadosCam_t_e_ta(eTruck01,"9","7",95,47,0).
dadosCam_t_e_ta(eTruck01,"9","8",69,28,0).
dadosCam_t_e_ta(eTruck01,"9","10",109,51,24).
dadosCam_t_e_ta(eTruck01,"9","11",61,29,0).
dadosCam_t_e_ta(eTruck01,"9","12",132,57,31).
dadosCam_t_e_ta(eTruck01,"9","13",67,19,0).
dadosCam_t_e_ta(eTruck01,"9","14",143,66,45).
dadosCam_t_e_ta(eTruck01,"9","15",71,34,0).
dadosCam_t_e_ta(eTruck01,"9","16",15,3,0).
dadosCam_t_e_ta(eTruck01,"9","17",67,28,0).

dadosCam_t_e_ta(eTruck01,"10","1",97,30,0).
dadosCam_t_e_ta(eTruck01,"10","2",34,14,0).
dadosCam_t_e_ta(eTruck01,"10","3",59,27,0).
dadosCam_t_e_ta(eTruck01,"10","4",78,33,0).
dadosCam_t_e_ta(eTruck01,"10","5",71,30,0).
dadosCam_t_e_ta(eTruck01,"10","6",40,14,0).
dadosCam_t_e_ta(eTruck01,"10","7",82,42,0).
dadosCam_t_e_ta(eTruck01,"10","8",65,24,0).
dadosCam_t_e_ta(eTruck01,"10","9",109,52,25).
dadosCam_t_e_ta(eTruck01,"10","11",92,46,0).
dadosCam_t_e_ta(eTruck01,"10","12",32,6,0).
dadosCam_t_e_ta(eTruck01,"10","13",99,46,0).
dadosCam_t_e_ta(eTruck01,"10","14",63,17,0).
dadosCam_t_e_ta(eTruck01,"10","15",74,34,0).
dadosCam_t_e_ta(eTruck01,"10","16",105,46,0).
dadosCam_t_e_ta(eTruck01,"10","17",53,23,0).

dadosCam_t_e_ta(eTruck01,"11","1",164,65,42).
dadosCam_t_e_ta(eTruck01,"11","2",88,41,0).
dadosCam_t_e_ta(eTruck01,"11","3",65,28,0).
dadosCam_t_e_ta(eTruck01,"11","4",42,18,0).
dadosCam_t_e_ta(eTruck01,"11","5",55,25,0).
dadosCam_t_e_ta(eTruck01,"11","6",118,57,31).
dadosCam_t_e_ta(eTruck01,"11","7",74,23,0).
dadosCam_t_e_ta(eTruck01,"11","8",59,23,0).
dadosCam_t_e_ta(eTruck01,"11","9",63,28,0).
dadosCam_t_e_ta(eTruck01,"11","10",97,46,0).
dadosCam_t_e_ta(eTruck01,"11","12",111,52,25).
dadosCam_t_e_ta(eTruck01,"11","13",25,7,0).
dadosCam_t_e_ta(eTruck01,"11","14",126,58,33).
dadosCam_t_e_ta(eTruck01,"11","15",53,25,0).
dadosCam_t_e_ta(eTruck01,"11","16",59,27,0).
dadosCam_t_e_ta(eTruck01,"11","17",67,27,0).

dadosCam_t_e_ta(eTruck01,"12","1",76,23,0).
dadosCam_t_e_ta(eTruck01,"12","2",61,19,0).
dadosCam_t_e_ta(eTruck01,"12","3",67,32,0).
dadosCam_t_e_ta(eTruck01,"12","4",97,41,0).
dadosCam_t_e_ta(eTruck01,"12","5",92,38,0).
dadosCam_t_e_ta(eTruck01,"12","6",19,8,0).
dadosCam_t_e_ta(eTruck01,"12","7",82,42,0).
dadosCam_t_e_ta(eTruck01,"12","8",86,33,0).
dadosCam_t_e_ta(eTruck01,"12","9",128,61,37).
dadosCam_t_e_ta(eTruck01,"12","10",32,6,0).
dadosCam_t_e_ta(eTruck01,"12","11",109,50,23).
dadosCam_t_e_ta(eTruck01,"12","13",120,53,26).
dadosCam_t_e_ta(eTruck01,"12","14",40,10,0).
dadosCam_t_e_ta(eTruck01,"12","15",78,38,0).
dadosCam_t_e_ta(eTruck01,"12","16",126,54,28).
dadosCam_t_e_ta(eTruck01,"12","17",74,32,0).

dadosCam_t_e_ta(eTruck01,"13","1",174,65,42).
dadosCam_t_e_ta(eTruck01,"13","2",107,35,0).
dadosCam_t_e_ta(eTruck01,"13","3",74,29,0).
dadosCam_t_e_ta(eTruck01,"13","4",46,11,0).
dadosCam_t_e_ta(eTruck01,"13","5",67,20,0).
dadosCam_t_e_ta(eTruck01,"13","6",128,57,31).
dadosCam_t_e_ta(eTruck01,"13","7",80,30,0).
dadosCam_t_e_ta(eTruck01,"13","8",76,20,0).
dadosCam_t_e_ta(eTruck01,"13","9",67,20,0).
dadosCam_t_e_ta(eTruck01,"13","10",105,47,0).
dadosCam_t_e_ta(eTruck01,"13","11",27,7,0).
dadosCam_t_e_ta(eTruck01,"13","12",122,52,25).
dadosCam_t_e_ta(eTruck01,"13","14",137,58,33).
dadosCam_t_e_ta(eTruck01,"13","15",67,17,0).
dadosCam_t_e_ta(eTruck01,"13","16",59,15,0).
dadosCam_t_e_ta(eTruck01,"13","17",78,22,0).

dadosCam_t_e_ta(eTruck01,"14","1",59,18,0).
dadosCam_t_e_ta(eTruck01,"14","2",80,35,0).
dadosCam_t_e_ta(eTruck01,"14","3",80,38,0).
dadosCam_t_e_ta(eTruck01,"14","4",109,46,0).
dadosCam_t_e_ta(eTruck01,"14","5",105,45,0).
dadosCam_t_e_ta(eTruck01,"14","6",27,9,0).
dadosCam_t_e_ta(eTruck01,"14","7",97,48,0).
dadosCam_t_e_ta(eTruck01,"14","8",99,38,0).
dadosCam_t_e_ta(eTruck01,"14","9",143,66,45).
dadosCam_t_e_ta(eTruck01,"14","10",61,17,0).
dadosCam_t_e_ta(eTruck01,"14","11",122,57,31).
dadosCam_t_e_ta(eTruck01,"14","12",42,10,0).
dadosCam_t_e_ta(eTruck01,"14","13",132,58,35).
dadosCam_t_e_ta(eTruck01,"14","15",90,44,0).
dadosCam_t_e_ta(eTruck01,"14","16",139,61,37).
dadosCam_t_e_ta(eTruck01,"14","17",86,38,0).

dadosCam_t_e_ta(eTruck01,"15","1",132,51,24).
dadosCam_t_e_ta(eTruck01,"15","2",74,30,0).
dadosCam_t_e_ta(eTruck01,"15","3",34,8,0).
dadosCam_t_e_ta(eTruck01,"15","4",36,12,0).
dadosCam_t_e_ta(eTruck01,"15","5",36,14,0).
dadosCam_t_e_ta(eTruck01,"15","6",86,44,0).
dadosCam_t_e_ta(eTruck01,"15","7",34,16,0).
dadosCam_t_e_ta(eTruck01,"15","8",42,13,0).
dadosCam_t_e_ta(eTruck01,"15","9",71,35,0).
dadosCam_t_e_ta(eTruck01,"15","10",82,36,0).
dadosCam_t_e_ta(eTruck01,"15","11",53,25,0).
dadosCam_t_e_ta(eTruck01,"15","12",80,38,0).
dadosCam_t_e_ta(eTruck01,"15","13",69,18,0).
dadosCam_t_e_ta(eTruck01,"15","14",95,45,0).
dadosCam_t_e_ta(eTruck01,"15","16",69,29,0).
dadosCam_t_e_ta(eTruck01,"15","17",53,17,0).

dadosCam_t_e_ta(eTruck01,"16","1",179,68,45).
dadosCam_t_e_ta(eTruck01,"16","2",92,37,0).
dadosCam_t_e_ta(eTruck01,"16","3",84,31,0).
dadosCam_t_e_ta(eTruck01,"16","4",57,16,0).
dadosCam_t_e_ta(eTruck01,"16","5",46,18,0).
dadosCam_t_e_ta(eTruck01,"16","6",132,60,35).
dadosCam_t_e_ta(eTruck01,"16","7",92,42,0).
dadosCam_t_e_ta(eTruck01,"16","8",67,23,0).
dadosCam_t_e_ta(eTruck01,"16","9",15,3,0).
dadosCam_t_e_ta(eTruck01,"16","10",105,46,0).
dadosCam_t_e_ta(eTruck01,"16","11",57,28,0).
dadosCam_t_e_ta(eTruck01,"16","12",130,52,25).
dadosCam_t_e_ta(eTruck01,"16","13",61,15,0).
dadosCam_t_e_ta(eTruck01,"16","14",141,61,37).
dadosCam_t_e_ta(eTruck01,"16","15",69,29,0).
dadosCam_t_e_ta(eTruck01,"16","17",65,24,0).

dadosCam_t_e_ta(eTruck01,"17","1",128,46,0).
dadosCam_t_e_ta(eTruck01,"17","2",42,14,0).
dadosCam_t_e_ta(eTruck01,"17","3",40,11,0).
dadosCam_t_e_ta(eTruck01,"17","4",42,13,0).
dadosCam_t_e_ta(eTruck01,"17","5",34,10,0).
dadosCam_t_e_ta(eTruck01,"17","6",82,38,0).
dadosCam_t_e_ta(eTruck01,"17","7",74,30,0).
dadosCam_t_e_ta(eTruck01,"17","8",29,6,0).
dadosCam_t_e_ta(eTruck01,"17","9",69,31,0).
dadosCam_t_e_ta(eTruck01,"17","10",55,24,0).
dadosCam_t_e_ta(eTruck01,"17","11",69,29,0).
dadosCam_t_e_ta(eTruck01,"17","12",80,30,0).
dadosCam_t_e_ta(eTruck01,"17","13",82,23,0).
dadosCam_t_e_ta(eTruck01,"17","14",90,38,0).
dadosCam_t_e_ta(eTruck01,"17","15",53,18,0).
dadosCam_t_e_ta(eTruck01,"17","16",67,25,0).

