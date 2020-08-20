import { Message } from '@myorg/api-types';

export async function hello(): Promise<Message> {
  return await fetch(`/api/hello`).then(res => res.json());
}