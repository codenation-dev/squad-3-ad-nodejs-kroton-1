function calculaMediaPonderada(n1, n2){
    //Define peso e soma
    let peso_1 = 2;
    let peso_2 = 3;
    let total_peso = peso_1 + peso_2;

    //Recebe nota e multiplica pelo peso
    let nota_1 = n1 * peso_1;
    let nota_2 = n2 * peso_2;
    let media = nota_1 + nota_2;

    //Calcula a media
    media = media / total_peso;

    //Retona a media
    return media;
}
//Printa o retorno da chamada da função
console.log(calculaMediaPonderada(10,2));