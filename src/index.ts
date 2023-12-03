import Phaser from 'phaser';
import config from './config';
import StartScene from './scenes/StartScene';
import MenuScene from './scenes/MenuScene';
import SubMenuScene from './scenes/SubMenuScene';
import GameScene from './scenes/Game';
// import PlaygroundScene from './scenes/PlaygroundScene';
import DiagramScene from './scenes/DiagramScene';
// import InputWindowScene from './scenes/InputWindowScene';

new Phaser.Game(
  Object.assign(config, {
    scene: [
      StartScene,
      MenuScene,
      SubMenuScene,
      GameScene,
      // PlaygroundScene,
      DiagramScene,
      // InputWindowScene,
    ],
  })
);
