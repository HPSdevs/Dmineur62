//
//   ReactMineur projet DWWM ©2024 HPSdevs, début 15/07/24@10h00
//
import { useState,useEffect} from "react";
 
export default function App() {
  const [buttondisabled, chgbuttonDisabled] = useState(false); 
  const [champs,setChamps]   = useState ();                    
  const [nbflag,setNbflag]   = useState (0);                   
  const [nbmine,setNbmine]   = useState (0);                   
  const [status,setStatus]   = useState (0);                   
  const [niveau,setNiveau]   = useState (1);                   
  const [taille,setTaille]   = useState (5);                   
  const [tool  ,setTool]     = useState (0);                   
  const [temps ,setTemps ]   = useState (0);                   
  const [action,SetAction]   = useState ([]);                  
  const etatjeu = [ "jeu en Arrêt"," jeu en Marche","vous avez Perdu","vous avez Gagné"];   
  const etattool= [ "Pioche","Drapeau","interrogation"]; 
  const autour  = [ [0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; 
  const contenu = {vu: false, affiche:false,  bombe:false }   



  useEffect(()=>{
  const field = Array.from(Array(taille), () => new Array(taille).fill({sol:"herbe",terre:"",nb: 0}));
  setChamps(field);
  },[taille])

  // temps
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
  function handleNiveau(x){
      setNiveau((niveau)=> ( (niveau===1 && x<0)? niveau : (niveau===9 && x>0) ? niveau : niveau+x))
  }
  function handleTaille(x){
      setTaille((taille)=> ( (taille===5 && x<1)? taille : (taille===20 && x>1) ? taille : taille*x))
  }
  /////////////////////////////////////////////
  // Le jeu
  function initialisation(){
    const surface = taille**2;                                              // nombre de cases
    const nbm = Math.floor(surface*niveau/10+Math.random()*niveau);              // % de mines par rapport aux cases
    setNbflag(nbm);                                                         // nombre de drapeau disponible
    setNbmine(nbm);                                                         // nombre de mines
    MettreMines();                                                          // parsemer le champ de mines
  }
 

  // affectation aléatoire des mines
  function MettreMines(){
    const field = Array.from(Array(taille), () => new Array(taille).fill({sol:"herbe",terre:" ",nb:0}));
    for (let i = 0; i < nbmine;i++) {
      let c,x,y = null;
      do { 
          x= Number(Math.floor( Math.random()*taille));
          y= Number(Math.floor( Math.random()*taille));
          c= field[y][x].terre;
        } while (c==="Mine")  // ne pas mettre une mine là ou il y en a déjà une ! sinon BOOOM!!!!
        autour.forEach((pos)=>{ 
          const xx = x+pos[0]<0 ? "OUT" : x+pos[0]>(taille-1) ? "OUT" : x+pos[0];
          const yy = y+pos[1]<0 ? "OUT" : y+pos[1]>(taille-1) ? "OUT" : y+pos[1];
          const zz = xx!="OUT" && yy!="OUT";
            if (zz) { 
              let old= field[yy][xx];
              field[yy][xx] = {...old, nb: old.nb+1};
            } 
          }
        )
        field[y][x]={sol:"herbe",terre:"Mine", value: 0};
      }
      setChamps(field);
  }
  function Look(x,y){
    if (status===1){
    console.log ("⚠️look",x,y)
    const vue= champs[y][x];
    console.log ("sol:",vue.sol,"terre:",vue.terre,"nb:", vue.nb)
    if (vue.terre==="Mine" & tool===0){ setStatus(2)}
    if (vue.sol==="herbe" & tool===1){ setsol(x,y,"flag")}
    }


    


  }
  
  function setsol(x,y,objet){
    console.log ("set",x,y, objet)
    const field= champs;
    field[y][x] = {sol:objet};
    setChamps(field);
    
  }
  return (
    <>
      <h1>** Bienvenue sur ReactDmineur **</h1>
      <h4>programme & interface en cours de développement</h4>
      <h4>Phase: etude des composants nécessaires</h4>
      <h4>©2024 by HPSdevs</h4>
      <p> Compteur  de jeu  : {temps}</p>
      <p><button onClick={()=>handleStart()}>START/RESET</button>&nbsp;status du jeu  : {etatjeu[status]} </p>
      <p>
        <button disabled={buttondisabled}  onClick={()=>handleNiveau(-1)}>-</button>
          &nbsp;Niveau de jeu (%mines): {niveau}&nbsp;
        <button onClick={()=>handleNiveau(1)} disabled={buttondisabled} >+</button>
      </p>
      <p>
        <button disabled={buttondisabled}  onClick={()=>handleTaille(.5)}>-</button>
          &nbsp;Taille champs (Nb cases): {taille}&nbsp;
        <button onClick={()=>handleTaille(2)} disabled={buttondisabled} >+</button>
      </p>
      <p>OUTILS:&nbsp; 
        <button onClick={()=>handleTool(0)}>Pioche {tool===0 && "en cours"}</button>&nbsp;
        <button onClick={()=>handleTool(1)}>Drapeau {tool===1 && "en cours"} ({nbflag} dispo)</button>&nbsp;
        <button onClick={()=>handleTool(2)}>Interrogation {tool===2 && "en cours"}</button>
      </p>
      <div className="champ">
        <>
          {status===2 && <div className="info"><h3>PERDU</h3></div>}
          {champs && champs.map((row, j) =>   
            <ul key={j}>
            {row.map((carre, i) => ( 
              <li key={j*100+i} className="herbe" onClick={()=>Look(i,j)}>{carre.nb>0 && carre.nb} {carre.terre}</li> ) )}    
            </ul>
          )}
        </>
      </div>    
    </>
  );
}