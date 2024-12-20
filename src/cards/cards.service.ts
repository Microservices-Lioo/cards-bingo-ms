import { PaginationDto } from './../commons/dto/pagination';
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CardsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('CardsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(createCardDto: CreateCardDto) {
    let card_nums = "";
    let existCard: any;

    // Create a card
    do {
      card_nums = "";
      card_nums = this.generateCard();

      existCard = await this.cards.findUnique({
        where: {
          event: createCardDto.event,
          nums: card_nums
        }
      });

    } while (existCard !== null);

    const numsCards = await this.cards.count({
      where: {
        event: createCardDto.event
      }
    });

    let numCard = numsCards + 1;
    return this.cards.create({
      data: {
        ...createCardDto,
        num: numCard,
        nums: card_nums
      }
    });
  }

  async findAllEvent(event: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.cards.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil( total / limit );

    return {
      data: await this.cards.findMany({
        where: {
          event: event,
          available: true
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        total,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const card = await  this.cards.findFirst({
      where: {
        id: id,
        available: true
      }
    });

    if ( !card ) throw new RpcException(`Card with id #${id} not found`);

    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  async remove(id: number) {

    await this.findOne(id);
    
    return await this.cards.update({
      where: {
        id: id
      },
      data: {
        available: false
      }
    })

  }

  generateCard() {
    const col1 = this.generateNumbersColm(1, 15, 5).sort((a, b) => a - b);
    const col2 = this.generateNumbersColm(16, 30, 5).sort((a, b) => a - b);
    const col3 = this.generateNumbersColm(31, 45, 5).sort((a, b) => a - b);
    const col4 = this.generateNumbersColm(46, 60, 5).sort((a, b) => a - b);
    const col5 = this.generateNumbersColm(61, 75, 5).sort((a, b) => a - b);

    col3[2] = 0;

    const allNumbers = [...col1, ...col2, ...col3, ...col4, ...col5];

    return allNumbers.join(",");
  }

  generateNumbersColm(min: number, max: number, cant: number) {
    const numbs: number[] = [];

    while (numbs.length < cant) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      if (!numbs.includes(num)) numbs.push(num);
    }
    return numbs;
  }
}
