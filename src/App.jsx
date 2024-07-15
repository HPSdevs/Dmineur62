//
//   ReactMineur projet DWWM ©2024 HPSdevs, début 15/07/24@10h00
//
import { useState,useEffect} from "react";
 
export default function App() {
  const [buttondisabled, chgbuttonDisabled] = useState(false); // dont change config in running
  const [champs,setChamps]   = useState ();            // OBJ le champs par lui même
  const [nbflag,setNbflag]   = useState (0);              // nombre de drapeaux disponible
  const [nbmine,setNbmine] = useState (0);              // nombre de mines à trouver
  const [status,setStatus]   = useState (0);             // statuts du jeu  (0=arret/init,1=marche,2=loose,3=win)
  const [niveau,setNiveau]   = useState (1);             // niveau du jeu  ( % de mines / surface)
  const [taille,setTaille]   = useState (1);            // taille du champs de bataille
  const [tool  ,setTool]     = useState (0);             // choix de l'outils donne  0 = pioche, 1=drapeau, 2=interrogation
  const [temps ,setTemps ]   = useState (0);             // temps de jeu, à chaque tic incremente ce compteur
  const [zoom  ,setZoom ]   = useState (1);              // niv de zoom du jeu
  const [action,SetAction]   = useState ([]);            // tableau de actions à faire (search tout autour)
  const etatjeu = [ "jeu en Arrêt"," jeu en Marche","vous avez Perdu","vous avez Gagné"];   // se basant sur status
  const etattool= [ "Pioche","Drapeau","interrogation"]; // se basant sur tool
  const search  = [ [0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; // sequence de search tout autour
  const contenu = {vu: false, affiche:false,  bombe:false }   // chaque case du champs contient

  // CHAMPS: contenu des différentes cases du champs de bataille :
  //   x  ,  y ,  casedecouverte (0/1) , affichage( rien = 0 , chiffre = {1 à 8}, (F) drapeau, (?) interrogation, mine)
  // le chiffre affiché donne le nombre de mines qui sont adjacentes à la case du chiffre.
  // ACTION: contenu des actions
  //  je clic sur  x ,  y  =>  verifier que cas  
  //  x+1 , y-1 => verifier  // x+1 , y => verifier  //  x+1 , y+1 => verifier  //  x , y+1 => verifier   //  x-1 , y+1 => verifier
  //  x-1 , y => verifier   //  x-1 , y-1 => verifier  // donc memoriser X,Y du clic si doigt pour rechercher case et tout autour

  useEffect(()=>{
  const field = Array.from(Array(taille*5), () => new Array(taille*5).fill("no"));
  setChamps(field);
  },[taille])

  // temps
  setTimeout(() => { compter() }, 1000);
  function compter(){
    if (status===1){setTemps((temps) => ++temps )}
  }

  // base start/stop
  function handleStart(){
    switch (status) {
      case 0:
        chgbuttonDisabled(true);
        initialisation();
        setTool(0);
        setTemps(0);
        setStatus(1);
        break;
      default:
        setStatus(0);
        clearTimeout();
        chgbuttonDisabled(false);
        break;
    }
  }
  // tool
  function handleTool(x){
      setTool(x);
  }
  // functions de base zoom (agrandissement visuel), niveau (% de nombre de mines), taille du champs (nombre de cases)
  function handleZoom(x){
      setZoom((zoom)=> ( (zoom===1 && x<0)? zoom : (zoom===5 && x>0) ? zoom : zoom+x))
  }
  function handleNiveau(x){
      setNiveau((niveau)=> ( (niveau===1 && x<0)? niveau : (niveau===9 && x>0) ? niveau : niveau+x))
  }
  function handleTaille(x){
      setTaille((taille)=> ( (taille===1 && x<0)? zoom : (taille===5 && x>0) ? taille : taille+x))
  }
  /////////////////////////////////////////////
  // Le jeu
  function initialisation(){
    const surface = (taille*5)**2;                                         // nombre de cases
    const nbm = Math.floor(surface*niveau/10+Math.random()*5);              // % de mines par rapport aux cases
    setNbflag(nbm);                                                         // nombre de drapeau disponible
    setNbmine(nbm);                                                         // nombre de mines
    MettreMines();                                                          // parsemer le champ de mines
  }


  // affectation aléatoire des mines
  function MettreMines(){
    const field = Array.from(Array(taille*5), () => new Array(taille*5).fill("no"));
    for (let i = 0; i < nbmine;i++) {
      let c,x,y = null;
      do { 
          x= Number(Math.floor( Math.random()*taille*5));
          y= Number(Math.floor( Math.random()*taille*5));
          c= field[x][y];
      } while (c!="no")  // ne pas mettre une mine là ou il y en a déjà une ! sinon BOOOM!!!!
      field[x][y]="bb";
    }
    setChamps(field);
  }


  return (
    <>
      <h1>** Bienvenue sur ReactDmineur **</h1>
      <h4>programme & interface en cours de développement</h4>
      <h4>©2024 by HPSdevs - version 240715.01.00</h4>
      <p> Compteur  de jeu  : {temps}</p>
      <p><button onClick={()=>handleStart()}>START/RESET</button>&nbsp;status du jeu  : {etatjeu[status]} </p>
      {/* <p><button onClick={()=>handleZoom(-1)}>-</button>&nbsp;Zoom du jeu: {zoom}&nbsp;<button onClick={()=>handleZoom(1)}>+</button></p> */}
      <p><button disabled={buttondisabled}  onClick={()=>handleNiveau(-1)}>-</button>&nbsp;Niveau de jeu (%mines): {niveau}&nbsp;<button onClick={()=>handleNiveau(1)} disabled={buttondisabled} >+</button></p>
      <p><button disabled={buttondisabled}  onClick={()=>handleTaille(-1)}>-</button>&nbsp;Taille champs (Nb cases): {taille}&nbsp;<button onClick={()=>handleTaille(1)} disabled={buttondisabled} >+</button></p>
      <p> OUTILS:&nbsp; 
      <button onClick={()=>handleTool(0)}>Pioche {tool===0 && "en cours"}</button>&nbsp;
      <button onClick={()=>handleTool(1)}>Drapeau {tool===1 && "en cours"} ({nbflag} dispo)</button>&nbsp;
      <button onClick={()=>handleTool(2)}>Interrogation {tool===2 && "en cours"}</button>
      </p>
      <div className="champ">
        <>
          {champs && champs.map((row, j) =>   
            <div key={j}>
            {row.map((trou, i) => ( <div className={trou}>{i},{j}</div> ) )}    
            </div>
          )}
        </>
      </div>    
    </>
  );
}