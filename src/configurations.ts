import {
  DropdownMenu,
  DropdownOption,
  SensorType,
} from './classes/DropdownMenu';
import ControlButton, { ButtonType } from './classes/ControlButton';

export const diagramContainerConfig = {
  x: 550,
  y: 90,
  width: 500,
  height: 250,
  borderRadius: 10,
  backgroundColor: 0xfcf6f5,
};

export const inputContainerConfig = {
  x: 550,
  y: 400,
  width: 500,
  height: 380,
  borderRadius: 10,
  backgroundColor: 0xfcf6f5,
};

export const controllerContainerConfig = {
  x: 210,
  y: 620,
  width: 320,
  height: 160,
  borderRadius: 10,
  backgroundColor: 0xfcf6f5,
};

export const playgroundContainerConfig = {
  x: 30,
  y: 90,
  size: 500,
  borderRadius: 10,
  backgroundColor: 0xfcf6f5,
};

export const playgroundTileConfig = {
  size: 50,
  lineWidth: 1,
  lineColor: 0x2bae66,
  lineColorAlpha: 128 / 255,
};

export const backButtonConfig = {
  x: 50,
  y: 50,
  texture: 'iconBack',
  selectedTexture: 'iconBackClick',
};
export const resetButtonConfig = {
  x: 100,
  y: 50,
  texture: 'iconReset',
  selectedTexture: 'iconResetClick',
};

export const stageLabelConfig = {
  x: 460,
  y: 45,
  fontSize: '16px',
  fontFamily: 'Roboto Condensed',
  color: '#FCF6F5',
};

export const playButtonConfig = {
  x: 65,
  y: 645,
  texture: 'playButton',
  selectedTexture: 'stopButton',
};

export const highligtToggleConfig = {
  x: 64,
  y: 689,
  texture: 'highlightToggleOff',
  selectedTexture: 'highlightToggleOn',
};

export const infoButtonConfig = {
  x: 1023,
  y: 55,
  texture: 'iconInfo',
  selectedTexture: 'iconInfoClick',
};

/** DropdownMenu Options */
export const options: DropdownOption[] = [
  {
    texture: 'wallFront',
    value: 'wallFront',
    type: SensorType.WallFront,
  },
  {
    texture: 'wallLeft',
    value: 'wallLeft',
    type: SensorType.WallLeft,
  },
  {
    texture: 'wallRight',
    value: 'wallRight',
    type: SensorType.WallRight,
  },
  {
    texture: 'monsterFront',
    value: 'monsterFront',
    type: SensorType.MonsterFront,
  },
  {
    texture: 'starBottom',
    value: 'starBottom',
    type: SensorType.StarBottom,
  },
];

/** Contorl Button Options */
export const buttonConfigurations = [
  {
    name: 'yesButton',
    type: ButtonType.YesButton,
    texture: 'yesButton',
    selectedTexture: 'yesButtonSelected',
    x: 370,
    y: 665,
  },
  {
    name: 'noButton',
    type: ButtonType.NoButton,
    texture: 'noButton',
    selectedTexture: 'noButtonSelected',
    x: 430,
    y: 665,
  },
  {
    name: 'yesNoButton',
    type: ButtonType.YesNoButton,
    texture: 'yesNoButton',
    selectedTexture: 'yesNoButtonSelected',
    x: 490,
    y: 665,
  },
  {
    name: 'forwardButton',
    type: ButtonType.ForwardButton,
    texture: 'forwardButton',
    selectedTexture: 'forwardButtonSelected',
    x: 250,
    y: 745,
  },
  {
    name: 'leftButton',
    type: ButtonType.LeftButton,
    texture: 'leftButton',
    selectedTexture: 'leftButtonSelected',
    x: 310,
    y: 745,
  },
  {
    name: 'rightButton',
    type: ButtonType.RightButton,
    texture: 'rightButton',
    selectedTexture: 'rightButtonSelected',
    x: 370,
    y: 745,
  },
  {
    name: 'putButton',
    type: ButtonType.PutButton,
    texture: 'putButton',
    selectedTexture: 'putButtonSelected',
    x: 430,
    y: 745,
  },
  {
    name: 'pickButton',
    type: ButtonType.PickButton,
    texture: 'pickButton',
    selectedTexture: 'pickButtonSelected',
    x: 490,
    y: 745,
  },
];

/** Dummy Button Options */
// export const dummyButtonConfigurations = [
//   {
//     name: 'yesNoButton',
//     type: ButtonType.YesNoButton,
//     texture: 'yesNoButton',
//     selectedTexture: 'yesNoButtonSelected',
//     x: 586,
//     y: 490,
//   },
//   {
//     name: 'yesNoButton',
//     type: ButtonType.YesNoButton,
//     texture: 'yesNoButton',
//     selectedTexture: 'yesNoButtonSelected',
//     x: 636,
//     y: 490,
//   },
//   {
//     name: 'yesNoButton',
//     type: ButtonType.YesNoButton,
//     texture: 'yesNoButton',
//     selectedTexture: 'yesNoButtonSelected',
//     x: 686,
//     y: 490,
//   },
//   {
//     name: 'yesNoButton',
//     type: ButtonType.YesNoButton,
//     texture: 'yesNoButton',
//     selectedTexture: 'yesNoButtonSelected',
//     x: 736,
//     y: 490,
//   },
// ];

export const conditionInputPoints = [
  { key: 'dummyBtn_11', x: 580, y: 490 },
  { key: 'dummyBtn_12', x: 630, y: 490 },
  { key: 'dummyBtn_13', x: 680, y: 490 },
  { key: 'dummyBtn_14', x: 730, y: 490 },
  { key: 'dummyBtn_21', x: 580, y: 555 },
  { key: 'dummyBtn_22', x: 630, y: 555 },
  { key: 'dummyBtn_23', x: 680, y: 555 },
  { key: 'dummyBtn_24', x: 730, y: 555 },
  { key: 'dummyBtn_31', x: 580, y: 620 },
  { key: 'dummyBtn_32', x: 630, y: 620 },
  { key: 'dummyBtn_33', x: 680, y: 620 },
  { key: 'dummyBtn_34', x: 730, y: 620 },
  { key: 'dummyBtn_41', x: 580, y: 685 },
  { key: 'dummyBtn_42', x: 630, y: 685 },
  { key: 'dummyBtn_43', x: 680, y: 685 },
  { key: 'dummyBtn_44', x: 730, y: 685 },
  { key: 'dummyBtn_51', x: 580, y: 750 },
  { key: 'dummyBtn_52', x: 630, y: 750 },
  { key: 'dummyBtn_53', x: 680, y: 750 },
  { key: 'dummyBtn_54', x: 730, y: 750 },
];

export const moveInputPoints = [
  { key: 'dummyBtn_15', x: 785, y: 490 },
  { key: 'dummyBtn_16', x: 835, y: 490 },
  { key: 'dummyBtn_17', x: 885, y: 490 },
  { key: 'dummyBtn_18', x: 935, y: 490 },
  { key: 'dummyBtn_25', x: 785, y: 555 },
  { key: 'dummyBtn_26', x: 835, y: 555 },
  { key: 'dummyBtn_27', x: 885, y: 555 },
  { key: 'dummyBtn_28', x: 935, y: 555 },
  { key: 'dummyBtn_35', x: 785, y: 620 },
  { key: 'dummyBtn_36', x: 835, y: 620 },
  { key: 'dummyBtn_37', x: 885, y: 620 },
  { key: 'dummyBtn_38', x: 935, y: 620 },
  { key: 'dummyBtn_45', x: 785, y: 685 },
  { key: 'dummyBtn_46', x: 835, y: 685 },
  { key: 'dummyBtn_47', x: 885, y: 685 },
  { key: 'dummyBtn_48', x: 935, y: 685 },
  { key: 'dummyBtn_55', x: 785, y: 750 },
  { key: 'dummyBtn_56', x: 835, y: 750 },
  { key: 'dummyBtn_57', x: 885, y: 750 },
  { key: 'dummyBtn_58', x: 935, y: 750 },
];

export const nextStatePoints = [
  { key: '19', x: 1005, y: 488 },
  { key: '29', x: 1005, y: 553 },
  { key: '39', x: 1005, y: 618 },
  { key: '49', x: 1005, y: 683 },
  { key: '59', x: 1005, y: 748 },
];

/** InputGuideline Coordinate */
export const guidelinePositions = [
  { x: 800, y: 486 },
  { x: 800, y: 551 },
  { x: 800, y: 616 },
  { x: 800, y: 681 },
  { x: 800, y: 746 },
];
