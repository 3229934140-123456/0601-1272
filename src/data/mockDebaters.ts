import type { Debater, Team } from '../types';

export const mockDebaters: Debater[] = [
  {
    id: 'debater-1',
    name: '张明远',
    role: 'first',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20portrait%20formal%20business&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-2',
    name: '李思琪',
    role: 'second',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20portrait%20formal%20business&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-3',
    name: '王浩然',
    role: 'third',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20young%20man%20portrait%20serious&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-4',
    name: '陈雨萱',
    role: 'fourth',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20young%20woman%20portrait%20confident&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-5',
    name: '刘子轩',
    role: 'first',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20male%20portrait%20scholar&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-6',
    name: '赵雅琳',
    role: 'second',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20female%20portrait%20intelligent&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-7',
    name: '孙博文',
    role: 'third',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20portrait%20glasses%20academic&image_size=square',
    isSpeaking: false,
  },
  {
    id: 'debater-8',
    name: '周晓彤',
    role: 'fourth',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20portrait%20elegant%20business&image_size=square',
    isSpeaking: false,
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: '星辰辩论队',
    side: 'affirmative',
    score: 85,
    debaters: [mockDebaters[0], mockDebaters[1], mockDebaters[2], mockDebaters[3]],
  },
  {
    id: 'team-2',
    name: '弘毅辩论队',
    side: 'negative',
    score: 82,
    debaters: [mockDebaters[4], mockDebaters[5], mockDebaters[6], mockDebaters[7]],
  },
];

export const currentUser = mockDebaters[0];
