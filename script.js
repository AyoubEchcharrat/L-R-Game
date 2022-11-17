async function getPlayers(){
    return await fetch("datas/LEC2022Springdata.json")
    .then(function(res){
        if(res.ok){
            return res.json()
        }
    })
    .then(function(value){
        console.log(value)
        console.log( typeof value)
        return (value) 
    })
    .catch(function(err){
        console.log(err)
    })
}

function photographerFactory(pro) {
    //factory qui renvoie l'HTML de chaque vignette photographe page d'accueil
    const { Player, Team , KDA , Pos, GD10, KP, WPM, CSPM ,DPM , CSD10 , CWPM , FBperc, CSP15} = pro;
    
    var nameInURL = Player.toLowerCase().replace(/ /g, "")
    console.log(nameInURL)
    const picture = `assets/players/${nameInURL}LIT.jpg`;
    function getPlayerCardDOM() {

        const card = document.createElement( 'div' );
        const imgContainer = document.createElement( 'div' );
        imgContainer.classList.add('card_img-container')
        const img = document.createElement('img');
        img.classList.add('card_img')
        img.setAttribute('src',picture);
        const textContainer = document.createElement('div');
        textContainer.classList.add('card_text-container')

        const textContainerLeft = document.createElement('div');
        textContainerLeft.classList.add('card_text-container-left');

        const textContainerRight = document.createElement('div');
        textContainerRight.classList.add('card_text-container-right');

        const score1 = document.createElement('p');
        score1.classList.add('card_score');
        score1.setAttribute('id','card_score1')
        const score2 = document.createElement('p');
        score2.classList.add('card_score');
        score2.setAttribute('id','card_score2')
        const score3 = document.createElement('p');
        score3.classList.add('card_score');
        score3.setAttribute('id','card_score3')
    
        // ----- SCORE 1 : PRECISION
        let scoreSub1 = parseInt(((CSPM * 10) + (positif(CSD10) * 10) + (returnPercentNum(CSP15) / 100)) /2.3)
        score1.textContent = scoreSub1 
        // ----- SCORE 2 : FORCE
        let scoreSub2 = parseInt((returnPercentNum(KP) + (KDA / 5) + returnPercentNum(FBperc) + (DPM / 100))*5.5)
        score2.textContent = scoreSub2
        // ----- SCORE 2 : VISION
        let scoreSub3 = parseInt(((WPM * 10) + (CWPM * 10) + returnPercentNum(KP)) * 3)
        score3.textContent = scoreSub3


        const h2 = document.createElement( 'h2' );
        h2.textContent = Player;
        const a = document.createElement( 'a' );
        a.href = `player.html?id=${Player}`;
        const teamOf = document.createElement( 'h3' );

        const inlineBottom = document.createElement('div');
        inlineBottom.classList.add('card_inline-bottom');

        teamOf.classList.add('card_team')
        teamOf.textContent = Team;
        const posOf = document.createElement( 'h3' );
        posOf.classList.add('card_pos')
        posOf.textContent = Pos;

        card.classList.add('card')
        h2.classList.add('card_player-name')
        a.classList.add('card_link')

        card.setAttribute('id',nameInURL)

        card.append(imgContainer)
        imgContainer.append(img)
        card.append(textContainer)
        textContainer.append(textContainerLeft)
        textContainer.append(textContainerRight)
        textContainerLeft.append(a)
        textContainerLeft.append(inlineBottom)
        inlineBottom.append(posOf)
        inlineBottom.append(teamOf)
        textContainerRight.append(score1)
        textContainerRight.append(score2)
        textContainerRight.append(score3)
        a.append(h2)

        return (card);
    }
    return { Player, getPlayerCardDOM }
} 

function returnPercentNum(perc){//renvoie une valeur entre 1 et 10 relatif à l'entrée perc
    var newperc = perc.replace(/%/i, "") / 10
    console.log("valeur ajouté = "+newperc)
    return parseInt(newperc)
}


function positif(num){
    if(num <0){
        return 0
    }else{
        return num
    }
}

async function displayData(players) {
    const playersSection = document.querySelector(".players_section");
    console.log(players)
    players.forEach((pro) => {
        const playerModel = photographerFactory(pro);
        const card = playerModel.getPlayerCardDOM();
        playersSection.appendChild(card);
    });
};



async function sortby(media){
    var newMedia = {};
    newMedia = media;
    var select = document.getElementById('select-sortby');

    if(select.value == 'score1'){
        newMedia.sort((a,b) => {return ( ((b.CSPM * 10) + (positif(b.CSD10) * 10) + (returnPercentNum(b.CSP15) / 100)) -  ((a.CSPM * 10) + (positif(a.CSD10) * 10) + (returnPercentNum(a.CSP15) / 100)) )})
        console.log('sort by precision')
    }
    if(select.value == 'score2'){
        newMedia.sort((a,b) => {return ((returnPercentNum(b.KP) + (b.KDA / 5) + returnPercentNum(b.FBperc) + (b.DPM / 100)) - (returnPercentNum(a.KP) + (a.KDA / 5) + returnPercentNum(a.FBperc) + (a.DPM / 100))) })
        console.log('sort by streight')
    }
    if(select.value == 'score3'){
        newMedia.sort((a,b) => {return ( (b.WPM * 10) + (b.CWPM * 10) + returnPercentNum(b.KP) ) - ((a.WPM * 10) + (a.CWPM * 10) + returnPercentNum(a.KP))})
        console.log('sort by vision')
    }
    
    console.log(newMedia)
    return newMedia
}


async function everySort(){
    const playersSection = document.querySelector(".players_section")
    playersSection.innerHTML = ""
    const players = await getPlayers()
    let newMedia = await sortby(players)
    displayData(newMedia);
}
 

async function init() {
    console.log('Init the game')
    // Récupère les datas
    const players = await getPlayers();
    let newMedia = await sortby(players)
    displayData(newMedia);
};

init();


document.getElementById('select-sortby').addEventListener('change',everySort,false)