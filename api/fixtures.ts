import mongoose from "mongoose";
import config from "./config";
import crypto from "crypto";
import User from "./models/User";
import Estate from "./models/Estate";

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('estates');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user, user2] = await User.create(
    {
      email: 'admin1@gmail.com',
      displayName: 'Admin',
      password: 'adminadmin1',
      token: crypto.randomUUID(),
      phoneNumber: '+996555555555',
      role: 'admin',
      avatar: null,
      verified: true,
    },
    {
      email: 'someuser@gmail.com',
      displayName: 'Walter',
      password: 'useruser1',
      token: crypto.randomUUID(),
      phoneNumber: '+996550902644',
      avatar: null,
      verified: true,
    },
    {
      email: 'someuser1@gmail.com',
      displayName: 'John',
      password: 'useruser1',
      token: crypto.randomUUID(),
      phoneNumber: '+996550902645',
      avatar: null,
      verified: true,
    },
  );

  await Estate.create({
    user: user._id,
    usdPrice: 85000,
    kgsPrice: 7500000,
    floor: 4,
    numberOfFloors: 9,
    numberOfRooms: 4,
    square: 105,
    condition: 'хорошее',
    town: 'Бишкек',
    estateType: 'Квартира',
    address: 'ул. Панфилова 77/8',
    description: `В квартире выполнен ремонт из качественных материалов.
        Новая мебель, бытовая техника, встроенные шкафы, кухонныи‌ гарнитур, хрустальные люстры, кондиционеры…
        Дом сеи‌смоустои‌чивыи‌. и сдан в эксплуатацию,
        все коммуникации центральные.
        Зимои‌ жарко летом прохладно.`,
    dealType: 'sale',
    images: ['fixtures/appart-1.jpg','fixtures/appart-2.jpg','fixtures/appart-3.jpg','fixtures/appart-4.jpg','fixtures/appart-5.jpg', ]
  }, {
    user: user2._id,
    usdPrice: 45000,
    kgsPrice: 3900000,
    numberOfFloors: 1,
    numberOfRooms: 3,
    square: 76,
    landArea: 5,
    condition: 'среднее',
    town: 'Бишкек',
    estateType: 'Дом',
    address: 'ж/м Киргизия-1 ул. Абдрахманова 89',
    description: `Продаётся дом, центральная канализация, электричество 3х фазное, 
      отопление паровое( газ, электричество), в шаговой доступности западный автовокзал, супермаркет,
      рестораны, кафе, школа , дет. сад..`,
    dealType: 'sale',
    isPublished: true,
    images: ['fixtures/house-1.jpg', 'fixtures/house-2.jpg', 'fixtures/house-3.jpg', 'fixtures/house-4.jpg', ]
  }, {
    user: user2._id,
    usdPrice: 800,
    kgsPrice: 70000,
    floor: 7,
    numberOfFloors: 14,
    numberOfRooms: 3,
    square: 110,
    condition: 'хорошее',
    town: 'Бишкек',
    estateType: 'Квартира',
    address: 'Джал Исанова/Ахунбаева',
    description: `Абсолютно новая квартира в новом доме, ранее не сдавалась.
        Имеется вся бытовая техника: Утюг, Smart TV, стиральная машина, холодильник, микроволновая печь, пылесос.
        Из мебели: двухспальная кровать, 2 детской кровати, шкаф, кухонная гарнитура, диван, 2 гардероба.`,
    dealType: 'rent',
    images: ['fixtures/appart2-1.jpg', 'fixtures/appart2-2.jpg', 'fixtures/appart2-3.jpg']
  }, {
    user: user._id,
    usdPrice: 50000,
    kgsPrice: 4700000,
    floor: 2,
    numberOfFloors: 11,
    numberOfRooms: 2,
    square: 60,
    condition: 'хорошее',
    town: 'Бишкек',
    estateType: 'Квартира',
    address: 'ул. Панфилова 70/8',
    description: `В квартире выполнен ремонт из качественных материалов.
        Новая мебель, бытовая техника, встроенные шкафы, кухонныи‌ гарнитур, хрустальные люстры, кондиционеры…
        Дом сеи‌смоустои‌чивыи‌. и сдан в эксплуатацию,
        все коммуникации центральные.
        Зимои‌ жарко летом прохладно.`,
    dealType: 'sale',
    isPublished: true,
    images: ['fixtures/appart-1.jpg','fixtures/appart-2.jpg','fixtures/appart-3.jpg','fixtures/appart-4.jpg','fixtures/appart-5.jpg', ]
  }, {
    user: user2._id,
    usdPrice: 45000,
    kgsPrice: 3900000,
    landArea: 5,
    town: 'Бишкек',
    estateType: 'Участок',
    address: 'ж/м Киргизия-1 ул. Абдрахманова 89',
    description: `Участок`,
    dealType: 'sale',
    isPublished: true,
    images: ['fixtures/house-1.jpg', 'fixtures/house-2.jpg', 'fixtures/house-3.jpg', 'fixtures/house-4.jpg', ]
  }, {
    user: user2._id,
    usdPrice: 500,
    kgsPrice: 43722,
    floor: 9,
    numberOfFloors: 20,
    numberOfRooms: 2,
    square: 45,
    condition: 'хорошее',
    town: 'Бишкек',
    estateType: 'Квартира',
    address: 'Тыныстанова/Ахунбаева 66 кв 7',
    description: `Абсолютно новая квартира в новом доме, ранее не сдавалась.
        Имеется вся бытовая техника: Утюг, Smart TV, стиральная машина, холодильник, микроволновая печь, пылесос.
        Из мебели: двухспальная кровать, 2 детской кровати, шкаф, кухонная гарнитура, диван, 2 гардероба.`,
    dealType: 'rent',
    isPublished: true,
    images: ['fixtures/appart2-1.jpg', 'fixtures/appart2-2.jpg', 'fixtures/appart2-3.jpg']
  }, );

  await db.close();
}

void run();