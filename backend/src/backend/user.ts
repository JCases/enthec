import axios from 'axios';

import { CodeErrors, Errors, IResponse, Post, User } from '../shared';

interface UserPost extends User {
  posts: Post[];
}

interface Response {
  code: number;
  data?: UserPost;
}

class UserBackend {
  public async getUser(id: string): Promise<Response> {
    try {
      const responseUser = await axios.get(
        `https://gorest.co.in/public-api/users/${id}`,
      );
      const user: User = { ...responseUser.data.data };

      if (responseUser.data.code !== 200) {
        return { code: CodeErrors.UNEXPECTED };
      }

      const responsePosts = await axios.get(
        `https://gorest.co.in/public-api/users/${id}/posts`,
      );
      const posts: Post[] = responsePosts.data.data;

      posts.map((p: Post) => {
        delete p.created_at;
        delete p.updated_at;
      });

      return { code: 200, data: { ...user, posts } };
    } catch (err) {
      return { code: CodeErrors.UNEXPECTED };
    }
  }

  public async paginationUsers(
    page?: number,
    limit?: number,
  ): Promise<IResponse<User[]>> {
    try {
      const users: User[] = [];
      if (page === undefined || isNaN(page)) page = 1;
      if (limit === undefined || isNaN(limit)) limit = 20;

      while (users.length < limit) {
        const url: string = `https://gorest.co.in/public-api/users?page=${page}&limit=${limit}`;
        const response = await axios.get(url);
        const usr = response.data.data;
        usr.map((u: User) => users.push(u));
        page++;
      }
      return { result: users };
    } catch (err) {
      return { error: { code: Errors.UNEXPECTED } };
    }
  }
}

const userBackend = new UserBackend();
export default userBackend;
