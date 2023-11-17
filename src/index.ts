import Phaser from 'phaser';
import config from './config';
import StateScene from './scenes/StartScene';
import MenuScene from './scenes/MenuScene';
import SubMenuScene from './scenes/SubMenuScene';
import GameScene from './scenes/Game';
import BackgroundScene from './scenes/BackgroundScene';
import PlaygroundScene from './scenes/PlaygroundScene';
import DiagramScene from './scenes/DiagramScene';
import InputWindowScene from './scenes/InputWindowScene';

new Phaser.Game(
  Object.assign(config, {
    scene: [
      StateScene,
      MenuScene,
      SubMenuScene,
      GameScene,
      BackgroundScene,
      PlaygroundScene,
      DiagramScene,
      InputWindowScene,
    ],
  })
);
