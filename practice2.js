let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick "];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");

const weapons = [
    {
        name:' stick',
        power: 5
    },
    {
        name:' dagger',
        power: 30
    },
    {
        name:' claw hammer',
        power:50
    },
    {
        name:' sword',
        power:100
    }
    
];

const monster = [
    {
        name:' slime',
        level: 2,
        health: 15
    },
    {
        name:' Fanged beast',
        level: 8,
        health: 60
    },
    {
        name:' Dragon',
        level: 20,
        health : 300
    }
];


const locations = [
    {
        name:'town square',
        'button text': ['Go to store', 'Go to cave', 'Fight dragon'],
        'button function': [goStore, goCave, fightDragon],
        text : 'You are in the town square. You see a sign that says \'store\''
    },
    
    {
        name: 'Store',
        'button text': ['Buy 10 health (10 gold)', 'Buy a weapon (30 gold)', 'Go to townsquare'],
        'button function': [buyHealth, buyWeapon, goTown],
        text: 'You entered the store'
    
    },
    {
        name:'Cave',
        'button text':['Fight slime', 'Fight beast','Go to town square'],
        'button function': [fightSlime, fightBeast,goTown],
        text:'You enter the cave and see some monsters'
    },
    {
        name:' fight',
        'button text':['Attack', 'Dodge', 'Run'],
        'button function':[attack, dodge, goTown],
        text: 'You are fighting a monster'
    },
    {
        name: 'kill monster',
        'button text':['Go to town square', 'Go to town square', 'Go to town square'],
        'button function':[goTown, goTown, easterEgg],
        text : "The monster screams 'Arg!!' as it dies. You gain experience points and find gold."
    },
    {
        name: 'lose',
        'button text': ['Replay?', 'Replay?', 'Replay?'],
        'button function': [restart, restart, restart],
        text: 'You Die'
    },
    {
        name: 'win',
        'button text': ['Replay?', 'Replay?', 'Replay?'],
        'button function': [restart, restart, restart],
        text: 'You defeated the dragon! YOU WIN THE GAME.' 
    },
    {
        name: 'esterEgg',
        'button text': ['2', '8', 'Go to townsquare'],
        'button function': [pickTwo, pickEight, goTown],
        text: 'You find a secret game. Pick a number above. Ten numbers will be randomly choosen between 0 to 10. If the number you choose matches one of the random numbers you will win!'
    }
];

// intializing buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// creating a function for the above button

function update(location){
    monsterStats.style.display = 'none';
    button1.innerText = location['button text'][0];
    button2.innerText = location['button text'][1];
    button3.innerText = location['button text'][2];
    button1.onclick = location['button function'][0];
    button2.onclick = location['button function'][1];
    button3.onclick = location['button function'][2];
    text.innerText = location.text;
}

function goTown(){
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}


function buyHealth(){
    if(gold >=10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else{
        text.innerText = 'You do not have enough gold to buy health';
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length -1 ){

        if(gold >=30){
            gold -= 30;
            goldText.innerText = gold;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText='You have a new weapon '+ newWeapon +'.';
            inventory.push(newWeapon);
            text.innerText += ' In your inventory you have: ' + inventory;
        }
        else{
            text.innerText = 'You do not have enough gold to buy a weapon';
        }
    }
    else{
        text.innerText = 'You already have the most power full weapon';
        button2.innerText = 'Sell weapon for 15 gold';
        button2.onclick = sellWeapon;

    }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = 'You sold '+ currentWeapon + '.';
        text.innerText += 'In your inventory you have '+ inventory;
    }
    else{
        text.innerText = 'Donot sell your only weapon';
    }
}

function fightSlime(){
    fighting = 0;
    goFight();

}

function fightBeast(){
    fighting = 1;
    goFight();
}

function fightDragon(){
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterHealth = monster[fighting].health;
    monsterStats.style.display = 'block';
    monsterNameText.innerText = monster[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    
}
function attack(){
    text.innerText = 'The ' + monster[fighting].name + 'attacks. \n';
    text.innerText += 'You attacking with your '+weapons[currentWeapon].name + '.';
    
    if(isMonsterHit()){
        health -= getMonsterAttackValue(monster[fighting].level);
    }
    else{
        text.innerText= 'You miss'
    }
    
    healthText.innerText = health;
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp)+1;
    monsterHealthText.innerText = monsterHealth;
    if(health <= 0){
        lose();
    }
    else if(monsterHealth <= 0){
        fighting===2 ? winGame() : defeatMonster();
    }
    
    if (Math.random() <= .1 && inventory.length !==1){
        text.innerText = 'Your ' + inventory.pop() + 'breaks.';
        currentWeapon--;
    }
    
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20
}

function getMonsterAttackValue(level){
    let hit = (level * 5)- (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function dodge(){
    text.innerText = 'You dodged the attack from the ' + monster[fighting].name + '.';

}

function defeatMonster(){
    gold += Math.floor(monster[fighting].level * 6.7);
    goldText.innerText = gold;
    xp += monster[fighting].level;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

function restart(){
     xp = 0;
     health = 100;
     gold = 50;
     currentWeapon = 0;
     inventory = ["stick "];
     goldText.innerText = gold;
     xpText.innerText = xp;
     healthText.innerText = health;
     goTown();
}

function easterEgg(){
    update(locations[7]);
}

function pickTwo(){
    pick(2);   
}

function pickEight(){
    pick(8);
}

function pick(guess){
    let numbers =[];
    while (numbers.length < 10){
        numbers.push(Math.floor(Math.random() *11));
    }

    text.innerText = 'You picked' +guess+ '. Here are the random numbers:\n';

    for (let i = 0; i < 10; i++ ){
        text.innerText += numbers[i] + '\n';
    }

    if (numbers.indexOf(guess) !== -1){
        text.innerText = "Rigth you will 20 gold";
        gold += 20;
        goldText.innerText = gold;
    }
    else{
        text.innerText = "Wrong you lose 10 health";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0){
            lose();
        }
    }
}