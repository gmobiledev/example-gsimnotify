import { Injectable } from '@nestjs/common';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { chunk } from 'lodash';
import * as shell from 'shelljs';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
  data?: any;
}

@Injectable()
export class FcmLibService {
  constructor() {
    // For simplicity these credentials are just stored in the environment
    // However these should be stored in a key management system
    // const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
    const firebaseCredentials = require("./../../../firebase-adminsdk.json")

    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  public async sendFirebaseMessages(firebaseMessages: ISendFirebaseMessages[], dryRun?: boolean): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    const batchResponses = await mapLimit<ISendFirebaseMessages[], BatchResponse>(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT, // 3 is a good place to start
      async (groupedFirebaseMessages: ISendFirebaseMessages[]): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] = groupedFirebaseMessages.map(({ message, title, token, data }) => ({
            data: data,
            notification: { body: message, title },
            token,
            apns: {
              payload: {
                aps: {
                  'content-available': 1,
                },
              },
            },
          }));

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          console.log(error);
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      ({
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown) as BatchResponse,
    );
  }


  public async sendFirebaseMessagesWithoutNotification(firebaseMessages: ISendFirebaseMessages[], dryRun?: boolean): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    const batchResponses = await mapLimit<ISendFirebaseMessages[], BatchResponse>(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT, // 3 is a good place to start
      async (groupedFirebaseMessages: ISendFirebaseMessages[]): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] = groupedFirebaseMessages.map(({ message, title, token, data }) => ({
            data: data,
            token,
            android: {
              priority: "high",
              ttl: 0
            },
            apns: {
              payload: {
                aps: {
                  'content-available': 1,
                },
              },
            }
          }));

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          console.log(error);
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      ({
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown) as BatchResponse,
    );
  }

  public async sendAll(messages: firebase.messaging.TokenMessage[], dryRun?: boolean): Promise<BatchResponse> {
    // if (process.env.NODE_ENV === 'localhost') {
    //   for (const { notification, token } of messages) {
    //     shell.exec(
    //       `echo '{ "aps": { "alert": ${JSON.stringify(notification)}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`,
    //     );
    //   }
    // }
    try {
      return firebase.messaging().sendAll(messages, dryRun);  
    } catch (error) {
      console.log(error);
    }
    
  }

  public async sendToDevice(token: string, playload: any, options?: any) {
    return firebase.messaging().sendToDevice(token, playload, options);
  }

  

}


