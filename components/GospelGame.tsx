"use client";

import { useState, useEffect, useRef } from "react";

/* ── 성경 본문 (개역개정) ──────────────────────────────────
   권한 보유 정본을 한 글자도 바꾸지 말고 채우세요. 비우면 빈 슬롯으로 표시됩니다.
   개발 중에는 화면의 '본문 입력 → 코드로 내보내기'로 채운 뒤 여기에 붙여 넣으세요. */
const VERSES: Record<string, string> = {
  "누가복음 2:10-11": "천사가 이르되 무서워하지 말라 보라 내가 온 백성에게 미칠 큰 기쁨의 좋은 소식을 너희에게 전하노라\n오늘 다윗의 동네에 너희를 위하여 구주가 나셨으니 곧 그리스도 주시니라",
  "마태복음 1:23": "보라 처녀가 잉태하여 아들을 낳을 것이요 그의 이름은 임마누엘이라 하리라 하셨으니 이를 번역한즉 하나님이 우리와 함께 계시다 함이라",
  "마태복음 3:17": "하늘로부터 소리가 있어 말씀하시되 이는 내 사랑하는 아들이요 내 기뻐하는 자라 하시니라",
  "요한복음 3:16": "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
  "요한복음 11:25": "예수께서 이르시되 나는 부활이요 생명이니 나를 믿는 자는 죽어도 살겠고",
  "요한복음 13:34": "새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라",
  "누가복음 23:43": "예수께서 이르시되 내가 진실로 네게 이르노니 오늘 네가 나와 함께 낙원에 있으리라 하시니라.",
  "요한복음 19:30": "예수께서 신 포도주를 받으신 후에 이르시되 ‘다 이루었다’ 하시고 머리를 숙이니 영혼이 떠나가시니라",
  "고린도전서 15:3-4": "내가 받은 것을 먼저 너희에게 전하였노니 이는 성경대로 그리스도께서 우리 죄를 위하여 죽으시고 장사 지낸 바 되셨다가 성경대로 사흘 만에 다시 살아나사",
  "사도행전 1:11": "이르되 갈릴리 사람들아 어찌하여 서서 하늘을 쳐다보느냐 너희 가운데서 하늘로 올려지신 이 예수는 하늘로 가심을 본 그대로 오시리라 하였느니라",
  "요한계시록 21:4": "모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니 처음 것들이 다 지나갔음이러라",
};

const NAVY = "#0b1729";
const NAVY2 = "#13233f";
const GOLD = "#d8b364";

type Choice = { label: string; next: string };
type Collect = { title: string; ref: string; note: string };
type Scene = {
  ch: number;
  text: string[];
  choices?: Choice[];
  verses?: string[];
  reflect?: string;
  collect?: Collect;
  actIntro?: boolean;
  ending?: boolean;
  title?: string;
};

const CHAPTERS: Record<number, { label: string; sub: string }> = {
  1: { label: "1막 · 탄생", sub: "별을 따라" },
  2: { label: "2막 · 사역", sub: "사랑이 걸어오다" },
  3: { label: "3막 · 십자가", sub: "다 이루었다" },
  4: { label: "4막 · 부활", sub: "사랑이 이기다" },
  5: { label: "5막 · 약속", sub: "다시 오시리라" },
};

const SCENES: Record<string, Scene> = {
  c1_1: { ch: 1, text: ["베들레헴 들판의 밤. 너는 양을 지키는 어린 목자다. 형들과 함께 모닥불에 둘러앉아 있다.", "세상은 무겁고 고요하다. 사람들은 오래전부터 ‘오시기로 한 분’을 기다리지만, 약속은 좀처럼 이루어지지 않는 듯했다.", "그 순간, 밤하늘이 갑자기 대낮처럼 환해진다. 빛 가운데 천사가 큰 소식을 전한다."], verses: ["누가복음 2:10-11"], choices: [{ label: "빛을 향해 달려 나간다", next: "c1_2" }, { label: "무서워 양 떼 뒤에 몸을 숨긴다", next: "c1_2b" }] },
  c1_2: { ch: 1, text: ["네가 달려 나가자, 한 천사 뒤로 셀 수 없이 많은 하늘 군대가 나타나 하나님을 찬양한다.", "두려움이 어느새 가슴 벅찬 기쁨으로 바뀐다. 가장 낮은 들판에, 가장 높은 소식이 내려왔다."], choices: [{ label: "노래를 따라 마을로 향한다", next: "c1_3" }] },
  c1_2b: { ch: 1, text: ["무서워 몸을 웅크렸지만, 그 노래는 두려움의 틈을 비집고 들어와 기어이 네 마음을 끌어낸다.", "은혜는 용감한 자만 부르지 않는다. 떨고 있는 너 같은 아이에게도 손을 내민다."], choices: [{ label: "조심스레 일어나 노래를 따라간다", next: "c1_3" }] },
  c1_3: { ch: 1, text: ["마을은 인구 조사로 몰려든 사람들로 발 디딜 틈이 없다. 여관마다 ‘빈방 없음’.", "천사가 일러 준 표적을 따라간 곳은 화려한 궁이 아니라 짐승들이 머무는 허름한 마구간이었다."], choices: [{ label: "떨리는 마음으로 안을 들여다본다", next: "c1_4" }] },
  c1_4: { ch: 1, text: ["구유 안에 갓난아기가 누워 있다. 온 세상의 왕이, 가장 낮고 가난한 자리에 오셨다.", "어머니 마리아의 눈에는 피곤과 경이가 함께 어리고, 요셉은 묵묵히 그 곁을 지킨다.", "너 같은 목자가 가장 먼저 초대받았다는 것이, 이 왕이 어떤 분인지를 말해 준다."], verses: ["마태복음 1:23"], reflect: "가장 낮은 자리에 오신 왕 앞에서, 나는 무엇을 내려놓아야 할까.", collect: { title: "임마누엘", ref: "마태복음 1:23", note: "하나님이 우리와 함께 계시다" }, choices: [{ label: "구유 앞에 무릎을 꿇는다", next: "c1_5" }] },
  c1_5: { ch: 1, text: ["며칠 뒤, 먼 동쪽에서 별을 따라온 박사들이 도착한다. 그들은 아기 앞에 황금과 유향과 몰약을 내려놓는다.", "왕에게 드리는 황금, 하나님께 드리는 유향, 그리고 장사 지낼 때 쓰는 몰약. 이 아기의 일생이 그 선물 안에 담겨 있는 듯하다."], choices: [{ label: "그 의미를 마음에 새긴다", next: "c1_6" }] },
  c1_6: { ch: 1, text: ["예루살렘 성전에서 한 노인이 아기를 품에 안았다는 소식이 전해진다. 평생 ‘오실 분’을 기다려 온 시므온이었다.", "그는 기뻐하면서도 어머니에게 묵직한 말을 남겼다 — 이 아이는 많은 사람을 일으키기도 넘어지게도 할 것이며, 칼이 어머니의 마음을 꿰뚫을 것이라고.", "기쁨의 한복판에, 이미 십자가의 그림자가 드리워 있다."], choices: [{ label: "그 예언의 무게를 느낀다", next: "c1_7" }] },
  c1_7: { ch: 1, text: ["권력을 두려워한 헤롯 왕이 아기를 죽이려 한다는 흉흉한 소문이 돈다. 아기의 가족은 한밤중에 이집트로 피난을 떠난다.", "구주는 태어나는 순간부터 환영이 아니라 위협을 받았다. 그러나 어둠은 그 빛을 삼키지 못한다.", "세월이 흐른다. 그 들판의 어린 목자였던 너도, 어느새 어른이 되었다."], choices: [{ label: "그 아기의 소식을 좇아 살아간다", next: "act2_intro" }] },

  act2_intro: { ch: 2, actIntro: true, text: ["삼십 년이 흘렀다. 광야에서 한 외침이 일어난다. ‘회개하라, 하나님 나라가 가까이 왔다.’"], choices: [{ label: "요단강으로 향한다", next: "c2_1" }] },
  c2_1: { ch: 2, text: ["요단강가, 세례 요한이 사람들에게 회개의 세례를 베푼다. 그때 한 사람이 물로 들어선다 — 그 옛날 구유의 아기, 이제 어른이 된 예수다.", "그분이 물에서 올라오자 하늘이 열리고, 비둘기 같은 성령이 내려온다. 그리고 하늘에서 음성이 울린다."], verses: ["마태복음 3:17"], collect: { title: "하늘의 음성", ref: "마태복음 3:17", note: "이는 내 사랑하는 아들이라" }, choices: [{ label: "그분을 가까이서 지켜본다", next: "c2_2" }] },
  c2_2: { ch: 2, text: ["그분은 광야로 들어가 사십 일을 홀로 보내신다. 굶주림의 끝에서 시험하는 자가 다가온다.", "‘돌을 빵으로, 성전 꼭대기에서 뛰어내리라, 내게 절하면 온 세상을 주겠다.’ 그분은 그때마다 말씀으로 물리치신다."], reflect: "나라면 그 시험 앞에서 무엇으로 버틸 수 있었을까.", choices: [{ label: "그 단호함에서 무언가를 배운다", next: "c2_3" }] },
  c2_3: { ch: 2, text: ["갈릴리 호숫가에서 그물을 손질하던 어느 날, 그분이 너를 똑바로 바라보며 부르신다.", "“나를 따라오라.”"], choices: [{ label: "그물을 내려놓고 따른다", next: "c2_4" }, { label: "생계와 가족이 떠올라 망설인다", next: "c2_4b" }] },
  c2_4b: { ch: 2, text: ["발이 쉬 떨어지지 않는다. 먹고살 일이, 두고 갈 사람들이 마음을 붙잡는다.", "그런데 그분은 재촉하지 않으신다. 조용히 기다리신다. 은혜는 결코 떠밀지 않는다."], choices: [{ label: "마침내 그물을 내려놓는다", next: "c2_4" }] },
  c2_4: { ch: 2, text: ["따르는 길의 첫 표적은 한 혼인 잔치에서 일어났다. 포도주가 떨어져 잔칫집이 난처해지자,", "그분은 항아리의 물을 더없이 좋은 포도주로 바꾸신다. 그분이 함께하시는 자리에서는, 부족함이 풍성함으로 바뀐다."], choices: [{ label: "더 가까이 따라붙는다", next: "c2_5" }] },
  c2_5: { ch: 2, text: ["산기슭에 사람들이 모이자 그분이 가르치신다. 세상이 비웃는 이들을 향해 ‘복이 있다’ 선언하신다.", "마음이 가난한 자, 슬퍼하는 자, 온유한 자, 의에 주리는 자, 긍휼히 여기는 자, 마음이 깨끗한 자, 화평케 하는 자에게.", "세상의 셈법이 뒤집힌다. 가장 약한 자리가 가장 복된 자리가 된다."], choices: [{ label: "그 말씀에 귀를 기울인다", next: "c2_6" }] },
  c2_6: { ch: 2, text: ["그분은 더 나아가 ‘원수를 사랑하고, 너를 미워하는 자를 위해 기도하라’ 하신다.", "그리고 염려에 짓눌린 이들에게 들꽃과 새를 가리키신다. 저들도 입히고 먹이시는 분이, 하물며 너를 모른 체하시겠느냐고."], choices: [{ label: "무거운 짐을 조금 내려놓는다", next: "c2_7" }] },
  c2_7: { ch: 2, text: ["어느 밤, 종교 지도자 니고데모가 남몰래 그분을 찾아온다. 그분은 그에게 ‘사람이 다시 태어나지 않으면 하나님 나라를 볼 수 없다’ 하신다.", "그것은 노력으로 쌓는 것이 아니라, 위로부터 새로 받는 생명이었다."], verses: ["요한복음 3:16"], reflect: "‘누구든지’ 안에 나도 들어 있음을, 나는 정말 믿고 있는가.", collect: { title: "거듭남과 하나님의 사랑", ref: "요한복음 3:3-16", note: "위로부터 새로 받는 생명" }, choices: [{ label: "‘다시 태어남’을 곱씹는다", next: "c2_8" }] },
  c2_8: { ch: 2, text: ["여행길, 그분은 모두가 피하던 사마리아를 지나며 한낮 우물가에서 한 여인과 마주 앉으신다.", "다섯 번 결혼했고 손가락질받던 그 여인에게 먼저 말을 건네신다 — 내가 주는 물을 마시는 자는 영원히 목마르지 않으리라고.", "가장 외면당하던 사람이, 가장 깊은 대화의 상대가 된다."], choices: [{ label: "그분의 거리낌 없는 사랑을 본다", next: "c2_9" }] },
  c2_9: { ch: 2, text: ["굶주린 무리 오천 명 앞, 한 아이가 보리떡 다섯과 물고기 둘을 내민다. 보잘것없는 도시락이다.", "그분의 손에 들리자, 작은 것이 모두를 먹이고도 남는다. 광주리 열둘이 가득 찬다.", "네가 내어 드린 작은 것이 그분 안에서 어떻게 되는지를, 너는 똑똑히 보았다."], choices: [{ label: "남은 광주리를 거든다", next: "c2_10" }] },
  c2_10: { ch: 2, text: ["그날 밤 배 위에서 거센 풍랑이 인다. 물이 들이치고, 너와 동료들은 죽음의 공포에 휩싸인다.", "그런데 그분은 고물에서 주무시고 계셨다. 깨우자 일어나 바람을 꾸짖으신다. 순식간에 바다가 호수처럼 잔잔해진다."], reflect: "내 인생의 풍랑 속에서, 나는 그분이 함께 계심을 신뢰하는가.", choices: [{ label: "“이분이 도대체 누구신가” 떨며 묻는다", next: "c2_11" }] },
  c2_11: { ch: 2, text: ["그분의 손길 닿는 곳마다 회복이 일어난다. 한 여인은 옷자락만 만져도 오랜 병이 나았고,", "아무도 가까이 가지 않던 나병환자에게 그분은 손을 대신다. 길가의 맹인 바디매오가 부르짖자, 멈춰 서서 그의 눈을 열어 주신다.", "사랑은 거리를 두지 않는다. 가장 멀리 밀려난 자에게 먼저 다가간다."], choices: [{ label: "치유받은 이들의 눈물을 본다", next: "c2_12" }] },
  c2_12: { ch: 2, text: ["여리고에서, 키 작은 세리 삭개오가 그분을 보려고 뽕나무에 올라가 있다. 모두가 죄인이라 손가락질하던 사람이다.", "그분은 그 나무 아래 멈춰 그의 이름을 부르며, 오늘 그의 집에 머물겠다 하신다.", "정죄가 아니라 초대가 그를 변화시킨다."], choices: [{ label: "그 식탁에 함께 앉는다", next: "c2_13" }] },
  c2_13: { ch: 2, text: ["사람들이 간음하다 잡힌 한 여인을 끌고 와 돌로 치려 한다. 그분은 몸을 굽혀 땅에 무언가를 쓰시고는, 죄 없는 자가 먼저 돌을 던지라 하신다.", "하나둘 손을 내려놓고 떠난다. 홀로 남은 여인에게 그분은 정죄하지 않으신다 — 가서 다시는 죄를 짓지 말라 하시며."], choices: [{ label: "용서가 사람을 살리는 것을 본다", next: "c2_14" }] },
  c2_14: { ch: 2, text: ["‘왜 죄인들과 함께 먹느냐’ 수군대는 이들에게, 그분이 이야기를 들려주신다.", "아흔아홉을 두고 잃은 한 마리 양을 찾아 나선 목자, 그리고 모든 것을 탕진하고 돌아온 아들을 멀리서부터 달려가 끌어안은 아버지.", "되돌아오기도 전에, 아버지가 먼저 뛰어왔다."], collect: { title: "잃은 양과 돌아온 아들", ref: "누가복음 15장", note: "아버지가 먼저 달려온다" }, choices: [{ label: "그 아버지의 마음에 잠긴다", next: "c2_15" }] },
  c2_15: { ch: 2, text: ["한 율법사가 ‘내 이웃이 누구입니까’ 묻자, 그분은 강도 만난 사람 곁을 그냥 지나친 제사장과 레위인,", "그리고 멸시받던 사마리아인이 그를 싸매고 돌본 이야기를 들려주신다. ‘가서 너도 이와 같이 하라.’"], choices: [{ label: "이웃의 의미를 새로 배운다", next: "c2_16" }] },
  c2_16: { ch: 2, text: ["친구 나사로가 죽은 지 나흘. 그분은 그 무덤 앞에서 눈물을 흘리신다. 하나님이 우시는 것을, 너는 두 눈으로 본다.", "그러고는 큰 소리로 외치신다. “나사로야, 나오너라.” 죽었던 자가 수의를 두른 채 걸어 나온다."], verses: ["요한복음 11:25"], collect: { title: "나는 부활이요 생명", ref: "요한복음 11:25", note: "죽음 너머의 약속" }, choices: [{ label: "그 말씀을 품고 예루살렘으로 향한다", next: "act3_intro" }] },

  act3_intro: { ch: 3, actIntro: true, text: ["유월절이 다가온다. 그분의 얼굴이 예루살렘을 향해 굳게 고정된다. 그곳에서 무슨 일이 기다리는지, 그분은 이미 알고 계셨다."], choices: [{ label: "성문으로 들어선다", next: "c3_1" }] },
  c3_1: { ch: 3, text: ["그분이 나귀 새끼를 타고 예루살렘에 들어오신다. 군중이 겉옷과 종려나무 가지를 길에 펴며 ‘호산나’ 외친다.", "왕은 군마가 아니라 나귀를 탔다. 칼이 아니라 평화를 들고 오셨다."], choices: [{ label: "함께 종려나무 가지를 흔든다", next: "c3_2" }] },
  c3_2: { ch: 3, text: ["성전 뜰이 장사꾼들의 흥정과 환전상의 돈 소리로 어지럽다. 그분이 상을 둘러엎으며, 기도하는 집을 강도의 소굴로 만들었다 꾸짖으신다.", "온유하신 그분의 눈에, 불의를 향한 거룩한 분노가 타오른다."], choices: [{ label: "그 단호함 앞에 옷깃을 여민다", next: "c3_3" }] },
  c3_3: { ch: 3, text: ["유월절 저녁, 다락방. 그분이 떡을 떼고 잔을 들며 ‘이것은 너희를 위해 주는 내 몸이요 피’라 하신다.", "그러더니 겉옷을 벗고 대야에 물을 받아, 제자들의 발을 하나하나 씻기기 시작하신다 — 종이 하는 일을, 스승이."], choices: [{ label: "“주님, 제 발도요?” 하고 발을 내민다", next: "c3_4" }, { label: "“제 발은 절대 안 됩니다” 손사래 친다", next: "c3_4" }] },
  c3_4: { ch: 3, text: ["발을 다 씻기신 뒤, 그분이 새 계명을 주신다."], verses: ["요한복음 13:34"], collect: { title: "새 계명", ref: "요한복음 13:34", note: "서로 사랑하라" }, choices: [{ label: "그 사랑을 마음에 새긴다", next: "c3_5" }] },
  c3_5: { ch: 3, text: ["겟세마네 동산. 그분의 기도는 땀이 핏방울처럼 떨어질 만큼 처절하다.", "“이 잔을 옮겨 주소서. 그러나 제 뜻이 아니라 아버지의 뜻대로 하소서.”", "곁에서 함께 깨어 기도해 달라 부탁하셨지만, 눈꺼풀이 천근만근이다."], reflect: "‘아버지의 뜻대로’라는 기도를, 나는 어디까지 드릴 수 있을까.", choices: [{ label: "졸음을 참고 함께 기도한다", next: "c3_6" }, { label: "지쳐 그만 잠이 든다", next: "c3_6b" }] },
  c3_6b: { ch: 3, text: ["깜빡 잠들었다 깨어 보니 멀리 횃불이 다가온다. 함께 깨어 있지 못한 후회가 밀려든다.", "그러나 그분은 너를 나무라지 않으신다. 약한 너를, 약한 그대로 받으신다."], choices: [{ label: "다가오는 무리를 바라본다", next: "c3_6" }] },
  c3_6: { ch: 3, text: ["제자 가룟 유다가 입맞춤으로 그분을 가리킨다. 그 신호로 병사들이 몰려와 그분을 붙잡는다.", "한 제자가 칼을 빼 들지만, 그분은 오히려 다친 자를 고쳐 주며 ‘칼을 도로 칼집에 꽂으라’ 하신다.", "끝까지, 그분의 길은 폭력이 아니라 내어 줌이었다."], choices: [{ label: "두려움 속에 그 뒤를 따른다", next: "c3_7" }] },
  c3_7: { ch: 3, text: ["끌려가시는 그분을 멀찍이 따라가는데, 사람들이 너를 알아본다. ‘너도 저 사람과 함께 있었지?’", "두려움이 온몸을 휘감는다. 곁에 있던 베드로처럼, 너의 입에서도 떨리는 부정이 새어 나오려 한다."], choices: [{ label: "“나는 저 사람을 모른다” 부인한다", next: "c3_8_deny" }, { label: "떨면서도 침묵을 지킨다", next: "c3_8" }] },
  c3_8_deny: { ch: 3, text: ["세 번째 부인이 끝나기 무섭게 닭이 운다. 마음이 무너져 내린다.", "끌려가던 그분이 고개를 돌려 너를 바라본다. 그 눈빛에는 책망이 없다. 오직 사랑이 있을 뿐이다.", "베드로도 밖으로 나가 통곡했다. 그러나 이 실패가 이야기의 끝은 아니었다."], choices: [{ label: "눈물을 훔치며 끝까지 따라간다", next: "c3_8" }] },
  c3_8: { ch: 3, text: ["빌라도의 법정. 총독은 그분에게서 죄를 찾지 못해 풀어 주려 한다. 관례에 따라 죄수 하나를 놓아줄 수 있었다.", "‘바라바냐, 예수냐?’ 군중은 살인자 바라바를 외친다. 죄 없는 분이 죄인의 자리에 서고, 죄인이 풀려난다.", "바로 그것이, 곧 일어날 일의 그림이었다. 그분이 네 자리에 서신다."], reflect: "풀려난 바라바의 자리에 내가 서 있다. 나는 그 자리를 어떻게 받아들이는가.", choices: [{ label: "뒤바뀐 자리의 의미를 깨닫는다", next: "c3_9" }] },
  c3_9: { ch: 3, text: ["병사들이 그분을 채찍질하고, 가시로 엮은 관을 머리에 씌운다. 자색 옷을 입히고 침을 뱉으며 조롱한다.", "그분은 한마디 보복도, 저주도 하지 않으신다. 묵묵히, 그 모든 것을 받으신다."], choices: [{ label: "차마 눈을 떼지 못한다", next: "c3_10" }] },
  c3_10: { ch: 3, text: ["그분은 무거운 형틀을 지고 골고다 언덕을 오른다. 기진해 쓰러지자, 지나가던 구레네 사람 시몬이 억지로 그 십자가를 대신 진다.", "길가에서 여인들이 통곡한다. 그분은 도리어 그들을 위로하신다 — 자신이 가장 고통스러운 순간에도."], choices: [{ label: "그 고난의 길을 묵묵히 따라 오른다", next: "c3_11" }] },
  c3_11: { ch: 3, text: ["십자가가 세워진다. 양옆에 매달린 두 죄수 중 하나가 마지막 숨으로 청한다 — ‘당신의 나라에 들어가실 때 저를 기억해 주십시오.’", "그분의 대답은, 공로도 시간도 없던 한 사람에게 마지막 숨결에 주어진 약속이었다."], verses: ["누가복음 23:43"], reflect: "공로 없이 주어진 약속 앞에서, 나는 무엇을 더 보태려 하고 있나.", collect: { title: "낙원의 약속", ref: "누가복음 23:43", note: "값없이, 마지막 순간에도" }, choices: [{ label: "끝까지 그 자리를 지킨다", next: "c3_12" }] },
  c3_12: { ch: 3, text: ["십자가 위에서 그분이 기도하신다. ‘아버지여, 저들을 용서하소서. 자기들이 하는 일을 알지 못합니다.’", "고통의 끝에서, 그분이 마지막으로 외치신다."], verses: ["요한복음 19:30"], reflect: "‘다 이루었다.’ 아직 내가 이루려 붙들고 있는 것은 무엇인가.", choices: [{ label: "찢어진 성전 휘장을 바라본다", next: "c3_12b" }] },
  c3_12b: { ch: 3, text: ["그 순간 성전의 휘장이 위에서 아래로 찢어진다. 하나님과 사람을 가르던 막이 사라졌다.", "땅이 흔들리고, 곁을 지키던 백부장이 고백한다. ‘참으로 이분은 하나님의 아들이었다.’", "네가 한 일이 아니라, 그분이 치르신 값으로 길이 열렸다."], choices: [{ label: "무너진 마음으로 그 자리에 머문다", next: "c3_13" }] },
  c3_13: { ch: 3, text: ["용기를 낸 아리마대 사람 요셉이 그분의 시신을 거두어, 아무도 사용하지 않은 새 무덤에 모신다. 큰 돌로 입구를 막는다.", "안식일이 내린다. 세상은 침묵한다. 모든 것이 끝난 것처럼 보인다.", "그러나 셋째 날이 아직 남아 있었다."], choices: [{ label: "무거운 안식일을 견딘다", next: "act4_intro" }] },

  act4_intro: { ch: 4, actIntro: true, text: ["안식 후 첫날, 동이 트기 전. 무덤으로 향하는 발걸음에는 슬픔과 향품만이 가득했다. 그들은 무덤을 막은 돌을 누가 굴려 줄지 걱정하고 있었다."], choices: [{ label: "여인들을 따라 무덤으로 간다", next: "c4_1" }] },
  c4_1: { ch: 4, text: ["새벽빛이 번지는 길, 향품을 든 손이 떨린다. 그런데 무덤에 다다르자—", "입구를 막았던 거대한 돌이 이미 굴려져 있다. 그리고 무덤 안은 비어 있다."], choices: [{ label: "두렵지만 안을 들여다본다", next: "c4_2" }] },
  c4_2: { ch: 4, text: ["빛나는 이가 말한다. ‘어찌하여 살아 계신 분을 죽은 자 가운데서 찾느냐. 그분은 여기 계시지 않다. 말씀하신 대로 살아나셨다.’"], choices: [{ label: "“혹시 누가 시신을 옮긴 건 아닐까” 의심한다", next: "c4_3_doubt" }, { label: "벅찬 마음으로 받아들인다", next: "c4_3" }] },
  c4_3_doubt: { ch: 4, text: ["도무지 믿기지 않는다. 죽은 자가 어떻게 살아난단 말인가.", "의심은 부끄러운 것이 아니다. 진실 앞에서 흔들리는 마음을, 그분은 내치지 않으신다. 곧 그 증거를 직접 보게 될 것이다."], choices: [{ label: "떨리는 마음으로 더 머문다", next: "c4_3" }] },
  c4_3: { ch: 4, text: ["무덤 곁에서 울고 있던 막달라 마리아에게, 한 분이 다가와 이름을 부르신다. “마리아야.”", "그 목소리 하나에 모든 것이 분명해진다. 그분이다. 죽음에서 돌아오신 그분이.", "그분은 잃은 자를 이름으로 부르신다. 무리가 아니라, 한 사람 한 사람으로."], reflect: "그분이 내 이름을 부르신다면, 나는 어떻게 답하고 싶은가.", choices: [{ label: "그 음성에 무릎이 꺾인다", next: "c4_4" }] },
  c4_4: { ch: 4, text: ["그날 오후, 두 제자가 낙심한 채 엠마오로 가는 길을 걷는다. 한 나그네가 다가와 동행하며 말씀을 풀어 준다.", "함께 식탁에 앉아 그가 떡을 떼는 순간, 두 사람의 눈이 열려 그분을 알아본다. 그러자 그분은 사라지신다.", "‘길에서 말씀을 풀어 주실 때, 우리 마음이 뜨겁지 않았던가.’"], choices: [{ label: "그 뜨거움을 함께 느낀다", next: "c4_5" }] },
  c4_5: { ch: 4, text: ["다락방에 모인 제자들 가운데 그분이 나타나신다. ‘너희에게 평강이 있으라.’ 그러나 도마는 그 자리에 없었다.", "‘내 손의 못 자국을 만져 보기 전에는 믿지 못하겠다’던 도마에게, 여드레 뒤 그분이 직접 손을 내미신다. ‘의심을 거두고 믿어라.’"], choices: [{ label: "도마처럼 “나의 주, 나의 하나님” 고백한다", next: "c4_6" }, { label: "의심하던 자도 품으심에 안도한다", next: "c4_6" }] },
  c4_6: { ch: 4, text: ["갈릴리 호숫가의 새벽. 부활하신 그분이 손수 숯불을 피우고 생선과 떡으로 아침을 차리신다.", "그분을 세 번 부인했던 베드로에게, 세 번 물으신다. ‘네가 나를 사랑하느냐.’ 그리고 세 번 맡기신다. ‘내 양을 먹이라.’", "실패한 자를 책망 대신 회복으로, 부르심으로 다시 세우신다. 너의 무너짐도 끝이 아니었다."], verses: ["고린도전서 15:3-4"], reflect: "나의 실패를 그분은 부르심으로 바꾸신다. 나는 그 회복을 받겠는가.", collect: { title: "복음의 핵심", ref: "고린도전서 15:3-4", note: "죽으시고, 장사되고, 다시 살아나심" }, choices: [{ label: "회복된 마음으로 그분을 따른다", next: "act5_intro" }] },

  act5_intro: { ch: 5, actIntro: true, text: ["부활하신 그분과 함께한 사십 일. 이제 그분은 마지막 당부와 함께, 한 가지 약속을 남기려 하신다."], choices: [{ label: "산 위로 따라 오른다", next: "c5_1" }] },
  c5_1: { ch: 5, text: ["산 위에서 그분이 ‘모든 민족을 제자로 삼으라, 내가 세상 끝날까지 너희와 함께 있겠다’ 당부하신다.", "그러고는 구름에 싸여 하늘로 오르신다. 그때 천사가 약속을 전한다."], verses: ["사도행전 1:11"], collect: { title: "다시 오심의 약속", ref: "사도행전 1:11", note: "본 그대로 다시 오시리라" }, choices: [{ label: "그 약속을 품고 내려간다", next: "c5_2" }] },
  c5_2: { ch: 5, text: ["오순절 날, 다락방에 모인 이들 위로 불의 혀 같은 성령이 임한다. 두려워 숨어 있던 사람들이 담대히 거리로 나선다.", "겁먹고 부인했던 베드로가, 이제 수천 명 앞에서 부활을 선포한다. 약한 자들이 그 사랑에 붙들려 강해졌다.", "그렇게 작은 무리에서 시작된 이야기가, 온 세상으로 번져 나간다."], choices: [{ label: "그 흐름의 한 사람이 된다", next: "c5_3" }] },
  c5_3: { ch: 5, text: ["그리고 마지막 그림이 펼쳐진다. 약속된 그날, 그분이 다시 오신다.", "새 하늘과 새 땅. 그분이 친히 모든 눈에서 눈물을 닦아 주시는 곳.", "구유에서 시작된 이야기는, 모든 눈물이 그치는 그 아침에서 완성된다."], verses: ["요한계시록 21:4"], collect: { title: "새 하늘과 새 땅", ref: "요한계시록 21:4", note: "모든 눈물을 닦아 주시리라" }, choices: [{ label: "그 소망을 가슴에 새긴다", next: "c5_4" }] },
  c5_4: { ch: 5, text: ["들판의 어린 목자로 시작된 이 이야기는, 사실 여기서 끝나지 않는다.", "부활과 다시 오심 사이, 그 사랑을 받고 또 전하며 살아가는 모든 사람에게로 이어진다.", "그리고 지금, 이 화면을 바라보는 ‘너’에게로."], verses: ["요한복음 3:16"], reflect: "이 사랑을, 나는 오늘 어떻게 살아 낼까.", choices: [{ label: "그 사랑을 받아들인다", next: "end_grace" }, { label: "아직은 잘 모르겠다", next: "end_open" }] },

  end_grace: { ch: 5, ending: true, title: "받은 사랑", text: ["네가 잘나서가 아니다. 충분히 노력해서도 아니다.", "그분이 먼저 오셨고, 먼저 사랑하셨고, 먼저 값을 치르셨다. 너는 그저 두 손을 펴 그 선물을 받았을 뿐이다.", "이제 그 사랑은 네 안에 머문다. 그리고 다른 누군가에게로 흘러간다."] },
  end_open: { ch: 5, ending: true, title: "열려 있는 문", text: ["아직 확신이 서지 않아도 괜찮다. 그분은 의심하던 도마도, 세 번 부인한 베드로도 내치지 않으셨다.", "이 문은 닫히지 않는다. 너의 속도로, 너의 자리에서, 천천히 다가와도 된다.", "그분은 재촉하지 않으시고, 끝까지 기다리신다."] },
};

const START = "c1_1";
const DEV = process.env.NODE_ENV !== "production";
const PROGRESS_KEY = "immanuel_progress";

const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 40 }).map((_, i) => (
      <span key={i} className="absolute rounded-full" style={{ top: ((i * 53) % 100) + "%", left: ((i * 37) % 100) + "%", width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2, background: GOLD, opacity: 0.15 + ((i * 7) % 50) / 100 }} />
    ))}
  </div>
);

const ScriptureCard = ({ refs, verses }: { refs: string[]; verses: Record<string, string> }) => (
  <div className="mt-8 space-y-4">
    {refs.map((r) => {
      const body = verses[r];
      return (
        <div key={r} className="p-5 rounded-xl border-l-2" style={{ borderColor: GOLD, background: "rgba(216,179,100,0.06)" }}>
          <p className="text-[10px] tracking-[0.25em] mb-2" style={{ color: GOLD }}>말씀 · 개역개정</p>
          {body ? <p className="font-serif text-slate-100 leading-relaxed">{body}</p> : <p className="text-slate-500 text-sm italic leading-relaxed">［개역개정 본문을 VERSES에 넣어 주세요］</p>}
          <p className="text-xs mt-3 tracking-wider" style={{ color: GOLD }}>— {r}</p>
        </div>
      );
    })}
  </div>
);

const ReflectBlock = ({ text }: { text: string }) => (
  <div className="mt-6 px-5 py-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
    <p className="text-[10px] tracking-[0.25em] mb-2 text-slate-400">✦ 묵상</p>
    <p className="text-slate-300 italic leading-relaxed text-[15px]">{text}</p>
  </div>
);

export default function GospelGame() {
  const [started, setStarted] = useState(false);
  const [sceneId, setSceneId] = useState(START);
  const [collected, setCollected] = useState<Collect[]>([]);
  const [showVerses, setShowVerses] = useState(false);
  const [verses, setVerses] = useState<Record<string, string>>(VERSES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(VERSES);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [restored, setRestored] = useState(false);
  const [resumable, setResumable] = useState<{ sceneId: string; collected: Collect[] } | null>(null);
  const scene = SCENES[sceneId];
  const chapter = scene ? CHAPTERS[scene.ch] : null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sceneId, started]);

  // 저장된 진행 상황 확인 (재방문 시 '이어서 읽기' 제안용 — 자동 시작은 하지 않음)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.started && typeof saved.sceneId === "string" && SCENES[saved.sceneId] && saved.sceneId !== START) {
          // SSR 안전: 초기 렌더 후 localStorage에서 한 번만 읽어 둔다
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setResumable({ sceneId: saved.sceneId, collected: Array.isArray(saved.collected) ? saved.collected : [] });
        }
      }
    } catch {}
    setRestored(true);
  }, []);

  // 진행 상황 저장 (이야기 진행 중에만 — 시작 화면이 저장본을 덮어쓰지 않도록)
  useEffect(() => {
    if (!restored || !started) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ sceneId, collected, started }));
    } catch {}
  }, [sceneId, collected, started, restored]);

  useEffect(() => {
    if (!DEV) return;
    try {
      const raw = localStorage.getItem("nkrv_verses");
      if (raw) {
        const saved = JSON.parse(raw);
        // SSR 안전: 개발용 편집본을 초기 렌더 후 한 번 불러온다
        /* eslint-disable react-hooks/set-state-in-effect */
        setVerses({ ...VERSES, ...saved });
        setDraft({ ...VERSES, ...saved });
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {}
  }, []);

  useEffect(() => {
    // 장면 진입 시 해당 말씀을 묵상 노트에 누적한다 (중복 방지)
    if (scene?.collect) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollected((prev) =>
        prev.some((v) => v.title === scene.collect!.title) ? prev : [...prev, scene.collect!]
      );
    }
    // sceneId가 바뀔 때만 실행 (scene은 sceneId에서 파생)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneId]);

  const choose = (next: string) => setSceneId(next);
  const beginFresh = () => {
    setSceneId(START); setCollected([]); setResumable(null); setStarted(true);
  };
  const resume = () => {
    if (!resumable) return;
    setSceneId(resumable.sceneId); setCollected(resumable.collected); setStarted(true);
  };
  const restart = () => {
    setSceneId(START); setCollected([]); setResumable(null); setStarted(false); setShowVerses(false);
    try { localStorage.removeItem(PROGRESS_KEY); } catch {}
  };

  const shareNotes = async () => {
    if (collected.length === 0) return;
    const body =
      "임마누엘 — 마음에 새긴 말씀\n\n" +
      collected.map((v) => `✦ ${v.title} (${v.ref})\n  ${v.note}`).join("\n\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "임마누엘 묵상 노트", text: body });
      } else {
        await navigator.clipboard.writeText(body);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  };
  const saveVerses = () => {
    setVerses(draft);
    try { localStorage.setItem("nkrv_verses", JSON.stringify(draft)); } catch {}
    setEditing(false);
  };

  if (!scene || !chapter) {
    return (
      <div className="relative w-full min-h-[100dvh] flex items-center justify-center px-6 text-center" style={{ background: "linear-gradient(" + NAVY2 + ", " + NAVY + ")" }}>
        <div className="max-w-sm">
          <div className="text-4xl mb-4" style={{ color: GOLD }}>✦</div>
          <p className="text-slate-300 leading-relaxed mb-6">이야기의 길을 찾지 못했습니다. 처음부터 다시 걸어 볼까요?</p>
          <button onClick={restart} className="px-8 py-3 rounded-full font-serif" style={{ background: GOLD, color: NAVY }}>처음으로</button>
        </div>
      </div>
    );
  }

  if (editing) {
    const exportCode = "const VERSES: Record<string, string> = {\n" + Object.keys(VERSES).map((r) => "  " + JSON.stringify(r) + ": " + JSON.stringify(draft[r] || "") + ",").join("\n") + "\n};";
    const copyCode = async () => { try { await navigator.clipboard.writeText(exportCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); } };
    return (
      <div className="relative w-full min-h-[100dvh] overflow-y-auto px-6 py-10" style={{ background: "linear-gradient(" + NAVY2 + ", " + NAVY + ")" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-2xl text-white mb-2">성경 본문 입력 · 개역개정</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">권한 있는 정본을 각 칸에 붙여 넣고, ‘코드로 내보내기’로 VERSES에 옮기세요.</p>
          <div className="space-y-5">
            {Object.keys(VERSES).map((r) => (
              <div key={r}>
                <label className="block text-xs mb-1 tracking-wider" style={{ color: GOLD }}>{r}</label>
                <textarea value={draft[r] || ""} onChange={(e) => setDraft({ ...draft, [r]: e.target.value })} rows={2} placeholder="개역개정 본문" className="w-full rounded-lg p-3 text-sm text-slate-100 font-serif leading-relaxed" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(216,179,100,0.25)", outline: "none" }} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <button onClick={saveVerses} className="px-7 py-3 rounded-full font-serif" style={{ background: GOLD, color: NAVY }}>저장</button>
            <button onClick={() => setShowCode((s) => !s)} className="px-7 py-3 rounded-full font-serif" style={{ border: "1px solid " + GOLD, color: GOLD }}>코드로 내보내기</button>
            <button onClick={() => setEditing(false)} className="px-7 py-3 rounded-full font-serif text-slate-300" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>취소</button>
          </div>
          {showCode && (
            <div className="mt-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: GOLD }}>이 블록을 GospelGame.tsx의 VERSES에 붙여 넣으세요</p>
                <button onClick={copyCode} className="text-xs underline" style={{ color: GOLD }}>{copied ? "복사됨" : "복사"}</button>
              </div>
              <textarea readOnly value={exportCode} rows={14} onFocus={(e) => e.target.select()} className="w-full rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(216,179,100,0.25)", outline: "none" }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="relative w-full min-h-[100dvh] flex items-center justify-center px-6 py-16" style={{ background: "radial-gradient(circle at 50% 20%, " + NAVY2 + ", " + NAVY + ")" }}>
        <Stars />
        <div className="relative text-center max-w-md">
          <div className="text-5xl mb-6">✦</div>
          <p className="font-serif tracking-[0.3em] text-sm mb-2" style={{ color: GOLD }}>임마누엘 · IMMANUEL</p>
          <p className="text-slate-400 text-xs mb-5">하나님이 우리와 함께 계시다</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white leading-snug mb-5">별에서 십자가,<br />그리고 다시 오심</h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">한 목자의 아이가 되어 예수님의 탄생부터 사역과 십자가, 부활과 다시 오심의 약속까지 그 길을 함께 걷습니다.</p>
          {resumable ? (
            <div className="flex flex-col items-center gap-3">
              <button onClick={resume} className="px-10 py-3 rounded-full font-serif text-base" style={{ background: GOLD, color: NAVY }}>이어서 읽기</button>
              <p className="text-slate-500 text-xs">읽던 곳: {CHAPTERS[SCENES[resumable.sceneId].ch].label}</p>
              <button onClick={beginFresh} className="text-xs underline text-slate-400">처음부터 다시 시작</button>
            </div>
          ) : (
            <button onClick={beginFresh} className="px-10 py-3 rounded-full font-serif text-base" style={{ background: GOLD, color: NAVY }}>이야기를 시작한다</button>
          )}
          {DEV && (<div className="mt-4"><button onClick={() => { setDraft(verses); setEditing(true); }} className="text-xs underline" style={{ color: GOLD }}>성경 본문(개역개정) 입력하기</button></div>)}
          <p className="text-slate-500 text-xs mt-8 leading-relaxed">‘말씀’ 카드는 개역개정 본문이며, 그 사이의 서술은 이해를 돕기 위한 상상입니다.<br /><span className="block mt-2">사건은 바뀌지 않고, 점수도 없습니다. 은혜는 값없이 주어집니다.</span></p>
        </div>
      </div>
    );
  }

  if (scene.actIntro) {
    const intro = scene.choices?.[0];
    return (
      <div ref={scrollRef} className="relative w-full min-h-[100dvh] flex items-center justify-center px-6 py-16" style={{ background: "radial-gradient(circle at 50% 35%, " + NAVY2 + ", " + NAVY + ")" }}>
        <Stars />
        <div className="relative text-center max-w-md">
          <p className="font-serif tracking-[0.35em] text-sm mb-3" style={{ color: GOLD }}>{chapter.label}</p>
          <h2 className="font-serif text-3xl text-white mb-8">{chapter.sub}</h2>
          {scene.text.map((p, i) => (<p key={i} className="text-slate-300 leading-relaxed text-[15px] mb-6">{p}</p>))}
          {intro && <button onClick={() => choose(intro.next)} className="mt-2 px-9 py-3 rounded-full font-serif" style={{ background: GOLD, color: NAVY }}>{intro.label}</button>}
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="relative w-full min-h-[100dvh] overflow-y-auto" style={{ background: "linear-gradient(" + NAVY2 + ", " + NAVY + ")" }}>
      <Stars />
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 backdrop-blur" style={{ background: "rgba(11,23,41,0.85)", borderBottom: "1px solid rgba(216,179,100,0.2)" }}>
        <div>
          <p className="font-serif text-xs tracking-widest" style={{ color: GOLD }}>{chapter.label}</p>
          <p className="text-slate-400 text-[11px]">{chapter.sub}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map((n) => (<span key={n} className="w-2 h-2 rounded-full" style={{ background: scene.ch >= n ? GOLD : "rgba(255,255,255,0.15)" }} />))}</div>
          <button onClick={() => setShowVerses((s) => !s)} className="text-[11px] px-2.5 py-1 rounded-full border" style={{ borderColor: "rgba(216,179,100,0.4)", color: GOLD }}>묵상 노트 {collected.length}</button>
        </div>
      </div>

      {showVerses && (
        <div className="relative px-5 py-4 mx-4 mt-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {collected.length === 0 ? <p className="text-slate-400 text-sm">아직 마음에 새긴 말씀이 없습니다.</p> : (
            <>
              <ul className="space-y-2">{collected.map((v, i) => (<li key={i} className="text-sm"><span className="font-serif" style={{ color: GOLD }}>{v.title}</span><span className="text-slate-400"> — {v.note}</span><span className="text-slate-500 text-xs"> ({v.ref})</span></li>))}</ul>
              <button onClick={shareNotes} className="mt-4 text-[11px] px-3 py-1.5 rounded-full border" style={{ borderColor: "rgba(216,179,100,0.4)", color: GOLD }}>{copied ? "복사됨" : "묵상 노트 공유 · 복사"}</button>
            </>
          )}
        </div>
      )}

      <div className="relative px-6 py-10 max-w-xl mx-auto">
        {scene.ending && <h2 className="font-serif text-2xl text-white text-center mb-6">{scene.title}</h2>}
        <div className="space-y-5">{scene.text.map((p, i) => (<p key={i} className="text-slate-200 leading-loose text-[15px]">{p}</p>))}</div>
        {scene.verses && <ScriptureCard refs={scene.verses} verses={verses} />}
        {scene.collect && <p className="mt-5 text-center text-xs" style={{ color: GOLD }}>✦ 말씀을 마음에 새겼습니다 — {scene.collect.title}</p>}
        {scene.reflect && <ReflectBlock text={scene.reflect} />}
        <div className="mt-10 space-y-3">
          {scene.ending ? (
            <div className="text-center space-y-5">
              <p className="text-slate-400 text-sm leading-relaxed">긴 여정에서 {collected.length}개의 말씀을 마음에 새겼습니다.<br />아래 말씀을 개역개정 성경에서 직접 펼쳐 읽어 보세요.</p>
              {collected.length > 0 && (<ul className="text-left inline-block space-y-1.5">{collected.map((v, i) => (<li key={i} className="text-sm"><span style={{ color: GOLD }}>✦</span> <span className="text-slate-200">{v.title}</span><span className="text-slate-500 text-xs"> ({v.ref})</span></li>))}</ul>)}
              <div className="flex flex-wrap gap-3 justify-center">
                {collected.length > 0 && (<button onClick={shareNotes} className="px-8 py-3 rounded-full font-serif" style={{ border: "1px solid " + GOLD, color: GOLD }}>{copied ? "복사됨" : "묵상 노트 공유"}</button>)}
                <button onClick={restart} className="px-8 py-3 rounded-full font-serif" style={{ background: GOLD, color: NAVY }}>다시 길을 걷는다</button>
              </div>
            </div>
          ) : (
            (scene.choices ?? []).map((c, i) => (
              <button key={i} onClick={() => choose(c.next)} className="w-full text-left px-5 py-4 rounded-xl text-slate-100 text-[15px] transition-all hover:translate-x-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(216,179,100,0.25)" }}><span style={{ color: GOLD }} className="mr-2">›</span>{c.label}</button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
