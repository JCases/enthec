import axios from 'axios';
import cheerio from 'cheerio';

import { App, Errors, IResponse } from './../shared';

class AppBackend {
  public async find(): Promise<IResponse<App[]>> {
    try {
      const url = 'https://play.google.com/store/apps';
      const AxiosInstance = axios.create();

      const gamesArray = AxiosInstance.get(url).then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const searchGames = $('body').find('.WHE7ib');
        const games = searchGames.slice(0, 5);

        const gamesArray: App[] = [];

        for (const g of games.toArray()) {
          gamesArray.push(await this.searchGames(g, $));
        }
        return gamesArray;
      });

      const games = await gamesArray;

      return { result: { ...games } };
    } catch (err) {
      return { error: { code: Errors.UNEXPECTED } };
    }
  }

  public async findByCategory(category: string): Promise<IResponse<App[]>> {
    try {
      const url = 'https://play.google.com/store/apps'; // To make it easier place the URL + category :P
      const AxiosInstance = axios.create();

      const categoryArray = AxiosInstance.get(url).then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const categoryHTML = $('body')
          .find('.zxErU')
          .find('.TEOqAc')
          .find('.KZnDLd');

        const categoryArray: string[] = [];

        for (const c of categoryHTML.toArray()) {
          categoryArray.push($(c).find('a').attr('href')!);
        }

        const categoryFound = categoryArray.find(
          (c) => c.replace('/store/apps/category/', '') === category,
        );

        const gamesArray = AxiosInstance.get(
          `https://play.google.com${categoryFound}`,
        ).then(async (response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const searchGames = $('body').find('.WHE7ib');
          const games = searchGames.slice(0, 5);

          const gamesArray: App[] = [];

          for (const g of games.toArray()) {
            gamesArray.push(await this.searchGames(g, $));
          }
          return gamesArray;
        });

        const gArray = await gamesArray;
        return gArray;
      });

      const categoryGames = await categoryArray;

      return { result: { ...categoryGames } };
    } catch (err) {
      return { error: { code: Errors.UNEXPECTED } };
    }
  }

  private searchGames = async (
    element: cheerio.Element,
    selector: cheerio.Root,
  ) => {
    // Get href for go to page info
    const name = selector(element)
      .find('.N9c7d.eJxoSc')
      .find('.wXUyZd')
      .find('a')
      .attr('href')!;

    const url = `https://play.google.com${name}`;
    const AxiosInstance = axios.create();

    const game = AxiosInstance.get(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const infoGame = $('main');
      return this.extractGameInfo(infoGame);
    });

    return game;
  };

  private extractGameInfo = (infoGame: cheerio.Cheerio): App => {
    const name = infoGame.find('h1').find('span').text().trim();
    const description = infoGame.find('.W4P4ne').find('meta').attr('content')!;
    const downloads = infoGame
      .find('.dNLKff')
      .find('span')
      .find('span')
      .text()
      .replace(/,/g, '')
      .trim();
    return {
      name,
      description,
      downloads: +downloads,
    };
  };
}

const appBackend = new AppBackend();
export default appBackend;
