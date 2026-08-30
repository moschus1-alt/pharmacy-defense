import Phaser from 'phaser';

type Enemy = { body: Phaser.GameObjects.Container; lane: number; hp: number; speed: number; dead: boolean };
type Defender = { body: Phaser.GameObjects.Container; lane: number; col: number; nextShot: number };
type Shot = { dot: Phaser.GameObjects.Arc; lane: number; damage: number };

export class GameScene extends Phaser.Scene {
  private readonly rows=5; private readonly cols=9;
  private readonly left=185; private readonly top=125; private readonly cellW=105; private readonly cellH=90;
  private enemies: Enemy[]=[]; private defenders: Defender[]=[]; private shots: Shot[]=[];
  private occupied=new Set<string>(); private nextSpawn=0; private cash=300; private cashText!: Phaser.GameObjects.Text;

  constructor(){ super('game'); }
  create(){
    this.add.rectangle(640,360,1280,720,0xd9e9c6);
    this.add.rectangle(82,350,145,500,0x9bc7b1).setStrokeStyle(5,0x386b5d);
    this.add.text(82,80,'조제실',{fontFamily:'sans-serif',fontSize:'28px',color:'#173c31',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(1170,80,'약국 입구 →',{fontFamily:'sans-serif',fontSize:'25px',color:'#7b2d20',fontStyle:'bold'}).setOrigin(.5);
    this.drawGrid();
    this.cashText=this.add.text(25,18,'💰 300',{fontFamily:'sans-serif',fontSize:'28px',color:'#183329',fontStyle:'bold'});
    this.add.text(640,35,'약국 디펜스  ·  Phase 1–2 Prototype',{fontFamily:'sans-serif',fontSize:'25px',color:'#183329',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(640,675,'빈 칸을 터치하면 기본 공격약 설치 (100원)',{fontFamily:'sans-serif',fontSize:'24px',color:'#183329'}).setOrigin(.5);
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>this.place(p.x,p.y));
    this.time.addEvent({delay:2500,loop:true,callback:()=>{this.cash+=25;this.updateCash();}});
  }
  private drawGrid(){
    for(let r=0;r<this.rows;r++) for(let c=0;c<this.cols;c++){
      const x=this.left+c*this.cellW+this.cellW/2,y=this.top+r*this.cellH+this.cellH/2;
      this.add.rectangle(x,y,this.cellW-3,this.cellH-3,(r+c)%2?0xbad998:0xcbe7aa,.9).setStrokeStyle(2,0x7fa36d);
    }
  }
  private place(x:number,y:number){
    const c=Math.floor((x-this.left)/this.cellW),r=Math.floor((y-this.top)/this.cellH);
    if(c<0||c>=this.cols||r<0||r>=this.rows||this.cash<100||this.occupied.has(`${r}:${c}`))return;
    this.cash-=100;this.updateCash();this.occupied.add(`${r}:${c}`);
    const cx=this.left+c*this.cellW+this.cellW/2,cy=this.top+r*this.cellH+this.cellH/2;
    const shadow=this.add.ellipse(0,25,58,16,0x000000,.18);
    const pill=this.add.rectangle(0,0,48,30,0xffffff).setStrokeStyle(4,0x244d42);
    const half=this.add.rectangle(-12,0,24,28,0xf05b61);
    const body=this.add.container(cx,cy,[shadow,pill,half]);
    this.defenders.push({body,lane:r,col:c,nextShot:0});
  }
  private spawn(){
    const lane=Phaser.Math.Between(0,4),y=this.top+lane*this.cellH+this.cellH/2;
    const shadow=this.add.ellipse(0,28,55,15,0x000000,.2);
    const head=this.add.circle(0,-10,24,0xf0c59e).setStrokeStyle(3,0x513c31);
    const torso=this.add.rectangle(0,23,43,46,0x7185a6).setStrokeStyle(3,0x38485f);
    const face=this.add.text(0,-10,'😠',{fontSize:'24px'}).setOrigin(.5);
    const body=this.add.container(1215,y,[shadow,torso,head,face]);
    this.enemies.push({body,lane,hp:100,speed:32,dead:false});
  }
  private shoot(d:Defender,time:number){
    const target=this.enemies.find(e=>!e.dead&&e.lane===d.lane&&e.body.x>d.body.x);
    if(!target||time<d.nextShot)return; d.nextShot=time+1100;
    d.body.setScale(1.08);this.tweens.add({targets:d.body,scale:1,duration:130});
    const dot=this.add.circle(d.body.x+30,d.body.y-3,10,0xf04e55).setStrokeStyle(2,0x6e2629);
    this.shots.push({dot,lane:d.lane,damage:25});
  }
  update(time:number,delta:number){
    if(time>this.nextSpawn){this.spawn();this.nextSpawn=time+Phaser.Math.Between(1800,3000);}
    for(const d of this.defenders)this.shoot(d,time);
    for(const e of this.enemies){if(e.dead)continue;e.body.x-=e.speed*delta/1000;if(e.body.x<145){e.dead=true;e.body.destroy();}}
    for(const s of [...this.shots]){
      s.dot.x+=360*delta/1000;
      const hit=this.enemies.find(e=>!e.dead&&e.lane===s.lane&&Math.abs(e.body.x-s.dot.x)<28);
      if(hit){hit.hp-=s.damage;s.dot.destroy();this.shots.splice(this.shots.indexOf(s),1);hit.body.setAlpha(.45);this.tweens.add({targets:hit.body,alpha:1,duration:100});if(hit.hp<=0){hit.dead=true;this.tweens.add({targets:hit.body,alpha:0,y:hit.body.y+20,duration:250,onComplete:()=>hit.body.destroy()});}}
      else if(s.dot.x>1280){s.dot.destroy();this.shots.splice(this.shots.indexOf(s),1);}
    }
  }
  private updateCash(){this.cashText.setText(`💰 ${this.cash}`);}
}
