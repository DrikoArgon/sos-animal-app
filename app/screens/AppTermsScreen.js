'use strict'

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native'

import StyleVars from '../styles/StyleVars'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AppTermsScreen extends Component{

    constructor(props){
        super(props)

    }


    render(){
        return(
            <View style={styles.container}>
                    <ScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps='never'
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                    >
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeaderStyle}>REGULAMENTO DO SOS ANIMAL APP</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O presente regulamento do aplicativo SOS Animal App abrange o Termo de Uso e a Política de Privacidade.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeaderStyle}>TERMO DE USO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>ACORDO COM O USUÁRIO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Este Termo de Uso apresenta as “Condições Gerais” aplicáveis ao uso dos serviços oferecidos por SOS ANIMAL APP, micro empreendedor individual (MEI), inscrita no CNPJ sob n.o 20.058.631/0001-79, doravante denominado “SOS Animal App”.
Qualquer pessoa, doravante nominada “Usuário” que pretenda utilizar os serviços do SOS Animal App deverá aceitar este Termo de Uso e todas as demais políticas e princípios que o regem. A UTILIZAÇÃO DO APLICATIVO E SEUS SERVIÇOS PRESUME A ACEITAÇÃO DO TERMO DE USO.
O Usuário deverá ler, certificar-se de haver entendido e aceitar todas as condições estabelecidas no Termo de Uso, no ato do acesso ao Aplicativo, assim como nos demais documentos incorporados aos mesmos por referência, antes de seu cadastro como Usuário do SOS Animal App.
O Usuário pode entrar em contato com o SOS Animal App através do e-mail sosanimalapp@sosanimalapp.com ou no link do aplicativo “Fale conosco”.
O Usuário concorda que, para ficar ciente de informações importantes relativas à sua conta e manter a comunicação com a empresa, o endereço de e-mail cadastrado será o canal de comunicação utilizado pelo SOS Animal App.
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>OBJETO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Os serviços, objeto do presente Termo de Uso, consistem em colocar à disposição dos Usuários, direta ou indiretamente cadastrados em seu aplicativo, bem como é um aplicativo que se destina a promover interações e meios de comunicação entre donos e protetores de animais.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Os usuários do aplicativo devem criar um perfil, por meio do qual poderão:</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                            <Text style={styles.textStyle}>1. Alocar um SOS no mapa para pedir ajuda aos usuários ao redor em razão de algum animal ferido ou abandonado encontrado necessitando de resgate;</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2. divulgar seu animal em lar temporário nos filtros de busca de animais;</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>3. buscar animais candidatos a adoção;</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>4. filtrar no mapa do aplicativo os alertas que deseja ver;</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>5. adicionar a uma lista de favoritos animais para adoção;</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>6. denunciar perfis e pins que sejam falsos ou tenham conteúdo impróprio.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O SOS Animal App não é responsável pelas informações falsas e a alocação de “pins” falsos no mapa, já que é somente um canal de divulgação de informações. Contamos com a participação dos Usuários na fiscalização através do recurso “Denunciar”.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>1.1. A exclusão de perfis e pins devido ao número de denúncias será automático e seguirá as seguintes regras:</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>1.1.1 Pin excluído quando tiver: 20 denúncias por ser falso; ou 10 denúncias por ter conteúdo impróprio; ou soma dos dois tipos de denúncias totalizar em 25.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>1.1.2 Perfil excluído quando tiver: 10 pins excluídos; ou 20 denúncias de perfil; ou soma dos dois tipos de denúncias totalizar em =25.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>3. buscar animais candidatos a adoção;</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>4. filtrar no mapa do aplicativo os alertas que deseja ver;</Text>
                    </View>   
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>1.2. O SOS Animal App se reserva o direito de alterar, suspender ou cancelar esta plataforma a qualquer momento, sem prévio aviso, ressalvadas as garantias estabelecidas no termo de uso do aplicativo.</Text>
                    </View> 
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>1.3. O SOS Animal App utiliza os cookies para facilitar o uso e melhor adaptar o APP aos interesses do usuário. Os cookies também podem ser utilizados para ajudar a acelerar suas atividades e experiências futuras em nossa plataforma. Também utilizamos cookies para compilar estatísticas anônimas e agregadas que nos permitem entender como as pessoas utilizam nossa plataforma e para nos ajudar a melhorar suas estruturas e conteúdos.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>CADASTRO NO APLICATIVO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>2.1 Em nenhuma hipótese serão permitidas a cessão, venda, aluguel ou outra forma de transferência da conta. Também não se permitirá a manutenção de mais de um cadastro por uma mesma pessoa, ou ainda a criação de novos cadastros por pessoas cujos cadastros originais tenham sido cancelados por infrações às políticas do SOS Animal App. Em todos estes casos, o SOS Animal App se reserva no direito de excluir todas as contas existentes do Usuário infrator.</Text>
                     </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2.2 Somente será confirmado o cadastro do interessado que preencher todos os campos assinalados com obrigatórios do cadastro. O futuro Usuário deverá completá-lo com informações exatas, precisas e verdadeiras, e assume o compromisso de atualizar os dados pessoais sempre que neles ocorrer alguma alteração.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2.3 O SOS Animal App não se responsabiliza pela correção dos dados pessoais inseridos por seus Usuários. Os Usuários garantem e respondem, em qualquer caso, pela veracidade, exatidão e autenticidade dos dados pessoais cadastrados.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2.4 O SOS Animal App se reserva o direito de utilizar todos os meios válidos e possíveis para identificar seus Usuários, bem como de solicitar dados adicionais e documento de identificação válido que estime ser pertinente, a fim de conferir os dados pessoais informados.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2.5 Caso exista a necessidade, por qualquer motivo, de conferência dos dados cadastrais de um Usuário e se constate haver dados incorretos ou inverídicos, ou ainda caso o Usuário se furte ou negue a enviar os documentos requeridos para conferência, o SOS Animal App poderá cancelar, definitivamente ou não, o cadastro do Usuário, sem prejuízo de outras medidas que entender necessárias e oportunas.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>
                            2.6 O Usuário que acessará sua conta através de e-mail e senha e compromete-se a não informar a terceiros esses dados, responsabilizando-se integralmente pelo uso que deles seja feito, bem como pelo seu cadastro pelo Facebook.</Text>
                    </View>
                    <View style={styles.textContainerBullet}>
                        <Text style={styles.textStyle}>2.7 O Usuário compromete-se a notificar o SOS Animal App imediatamente, e através de meio seguro, a respeito de qualquer uso não autorizado de sua conta, bem como o acesso não autorizado por terceiros à mesma. O Usuário será o único responsável pelas operações efetuadas em sua conta, uma vez que o acesso à mesma só será possível mediante a aposição da senha, cujo conhecimento é exclusivo do Usuário.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>CANCELAMENTO DO CADASTRO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O Usuário poderá a qualquer tempo cancelar o uso do aplicativo por qualquer motivo, não estando obrigado a avisar o motivo do cancelamento. Para cancelar, basta ir em seu “Perfil” e clicar na opção “Desativar Conta”.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>RESTRIÇÕES DE USO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O aplicativo SOS Animal App não permite o uso ou comercialização de sua marca sem a sua autorização prévia.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>MODIFICAÇÕES DO TERMO DE USO.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>4.1 O SOS Animal App poderá alterar, a qualquer tempo, este Termo de Uso, visando seu aprimoramento e melhoria dos serviços prestados. O novo Termo de Uso entrará em vigor a partir de sua publicação no aplicativo. No prazo de 24 (vinte e quatro) horas contadas a partir da publicação das modificações, o Usuário deverá comunicar por e-mail caso não concorde com o Termo de Uso alterado. Nesse caso, o vínculo contratual deixará de existir, desde que não haja contas ou dívidas em aberto em nome do Usuário. Não havendo manifestação no prazo estipulado, entender-se-á que o Usuário aceitou tacitamente o novo Termo de Uso e o contrato continuará vinculando as partes.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>4.2 As alterações não vigorarão em relação a Ofertas, Compromissos e aquisições já iniciados ao tempo em que as mesmas alterações sejam publicadas. Para estes, o Termo de Uso valerá com a redação anterior.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>PRIVACIDADE DA INFORMAÇÃO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>
                            5.1 O SOS Animal App tomará todas as medidas possíveis para manter a confidencialidade e a segurança descritas nesta cláusula, porém não responderá por prejuízo que possa ser derivado da violação dessas medidas por parte de terceiros que utilizem as redes públicas ou a internet, subvertendo os sistemas de segurança para acessar as informações de Usuários.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>5.2 Para obter maiores informações sobre a Política de Privacidade do SOS Animal App, o Usuário pode obter informações através do e-mail sosanimalapp@sosanimalapp.com.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>OBRIGAÇÕES DOS USUÁRIOS</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>6.1 É terminantemente proibida a venda de animais pela nossa plataforma, sendo punida com a exclusão da conta de usuário ou parceiro.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>VIOLAÇÃO NO SISTEMA OU BASE DE DADOS</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>7.1 Não é permitida a utilização de nenhum dispositivo, software, ou outro recurso que venha a interferir nas atividades e operações do SOS Animal App, descrições, contas ou seus bancos de dados. Qualquer intromissão, tentativa de, ou atividade que viole ou contrarie as leis de direito de propriedade intelectual e/ou as proibições estipuladas neste Termo de Uso, tornarão o responsável passível das ações legais pertinentes, bem como das sanções aqui previstas, sendo ainda responsável pelas indenizações por eventuais danos causados.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>SANÇÕES</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>8.1 Sem prejuízo de outras medidas, o SOS Animal App poderá advertir, suspender ou cancelar, temporária ou definitivamente, a conta de um Usuário a qualquer tempo, e iniciar as ações legais cabíveis se: a) o Usuário que não cumprir qualquer dispositivo deste Termo de Uso; b) se descumprir com seus deveres de Usuário; c) se praticar atos fraudulentos ou dolosos; d) se não puder ser verificada a identidade do Usuário ou qualquer informação fornecida por ele esteja incorreta; e) se o SOS Animal App entender que qualquer atitude do Usuário tenha causado algum dano a terceiros ou ao próprio SOS Animal App ou tenham a potencialidade de assim o fazer. O SOS Animal App reserva-se o direito de, a qualquer momento e a seu exclusivo critério, solicitar o envio de documentação pessoal.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>RESPONSABILIDADES DE FUNCIONAMENTO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>9.1 Tendo em vista a impossibilidade de funcionamento integral e ininterrupto de qualquer sistema de telecomunicação ou de informática, inclusive em razão da dependência de serviços de telecomunicações prestados por terceiros, o SOS Animal App não garante a prestação do serviço de forma ininterrupta e/ou isenta de erros. Eventualmente, o sistema poderá não estar disponível por motivos técnicos ou falhas da internet, ou por qualquer outro evento fortuito ou de força maior alheio ao controle do SOS Animal App.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>9.2 O SOS Animal App não é o proprietário dos produtos ou responsável pela qualidade dos produtos/ serviços ofertados. Logo, não intervém na entrega dos produtos ou na prestação dos serviços, atuando na qualidade de plataforma de interação de usuários e parceiros.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>PROPRIEDADE INTELECTUAL</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>10.1 O uso comercial da expressão “SOS Animal App” como marca, nome empresarial ou nome de domínio, bem como os conteúdos das telas relativas aos serviços do SOS Animal App assim como os programas, bancos de dados, redes e arquivos, que permitem que o Usuário acesse e use sua conta, são de propriedade do SOS Animal App e estão protegidos pelas leis e tratados internacionais de direito autoral, marcas, patentes, modelos e desenhos industriais. O uso indevido e a reprodução total ou parcial dos referidos conteúdos são proibidos, salvo a autorização expressa do SOS Animal App.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>10.2 O SOS Animal App não será responsável pelos conteúdos, práticas e serviços ofertados em outros sites que não sejam de propriedade ou operados por si, ainda que exista independentemente do motivo, link para os mesmos no aplicativo SOS Animal App. A presença de links para outros sites não implica relação de sociedade, de supervisão, de cumplicidade ou solidariedade do SOS Animal App para com esses sites e seus conteúdos.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>INDENIZAÇÃO</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>11.1 O Usuário indenizará o SOS Animal App, suas filiais, empresas controladas ou controladoras, diretores, administradores, colaboradores, representantes e empregados por qualquer demanda promovida por outros usuários ou terceiros decorrentes de suas atividades no site ou por seu descumprimento dos Termos de Uso ou pela violação de qualquer lei ou direitos de terceiros, incluindo honorários de advogados.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Não obstante a existência do presente Termo de Uso, a relação entre o SOS Animal App e o usuário é regida pelas leis brasileiras, em especial pelo Código de Defesa do Consumidor.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeader2Style}>POLÍTICA DE PRIVACIDADE</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Ao se cadastrar na plataforma SOS Animal App armazenamos o seu endereço de e-mail, endereço ip e os demais dados que foram informados ao site em nosso banco de dados protegido e sigilosos, no qual apenas alguns funcionários habilitados, que são obrigados, por contrato, a manter confidencialidade de suas informações.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Quando você se cadastra, solicitamos informações tais como seu nome, endereço de e- mail, data de nascimento, sexo, CEP, assim como assuntos de interesse pessoal, dentre outras. Ao se cadastrar na plataforma e utilizar nossos serviços, você deixa de ser anônimo para nós.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Utilizamos os seus dados para o envio de avisos de segurança, novidades, enquetes e qualquer assunto relativos ao aplicativo. Você poderá a qualquer momento solicitar a retirada de seu endereço de e-mail de nossas listas de envio, através do link disponível em nossas mensagens de e-mail.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O SOS Animal App não aluga, não vende e não compartilha as informações pessoais com outras pessoas ou com empresas não afiliadas, exceto com objetivo de fornecer a você os produtos e serviços solicitados, tendo obtido para tanto a sua permissão, ou em circunstâncias específicas como ordem judicial ou advindas de lei.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Ao se logar em nosso site, armazenaremos um cookie em seu smartphone com a única finalidade de identificar a sua conta SOS Animal App. Ao deslogar, este cookie será apagado. Armazenamos também a informação de sua cidade de escolha, para que nas próximas vezes que você acessar o aplicativo sempre apareça a cidade escolhida.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Você poderá solicitar a desativação do seu perfil a qualquer momento pelo fale conosco ou através do cancelamento de sua conta no aplicativo.</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O SOS Animal App poderá eventualmente atualizar esta política sem aviso prévio. As mudanças mais significativas, quando oportuno, poderão ser comunicadas em área de destaque no aplicativo ou através de e-mail.</Text>
                    </View>
                    <View style={styles.signatureContainer}>
                        <Text style={styles.textStyle}>Equipe SOS Animal App</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    textStyle:{
        color: 'white',
        fontSize: 14,
    },
    textHeaderStyle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },
    textHeader2Style: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    textContainer:{
        marginTop: 10,
        marginBottom: 10
    },
    signatureContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'flex-end'
    },
    textContainerBullet: {
        marginTop: 2,
        marginBottom: 2
    },
})