import { assign, createMachine } from 'xstate';

export interface MediaPlayerContext {
  atEnd: boolean;
  atBeginning: boolean;
}

const notAtEndGuard = (context: MediaPlayerContext) => !context.atEnd;
const notAtBeginning = (context: MediaPlayerContext) => !context.atBeginning;

export const mediaPlayerStateMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFlIEsCGACACgGwwE8wAnAOgGUAXAewAc7IBifIxUOm2NKtGgO3YgAHogCcAFgDsZMQFY5UiQoBsAJjkqJagDQhCiFQAYAjGQDMEiSalGpKuWJNqJAX1d7UETLgLFy1PSMEEwASmAA7mj8EEKc3LwCQqIIkjLyisqaGlq6+ogAHGKyBVImRSo29mJSUu6e6Nis-pS0DMwAYhiwVB00JBEYJLFIIPE8fIKjKc4FZmJ2auYqBaUm1ip6BgjKRhYqUhpS5svmYpX1IF4+zaRkzdFQTIF0cVwTSdOIinIWmuUSApqExGApyCRbRDWCQWAoSeRSApaA5qOoeK6NXxEO4PfhPHAYACusDAbwSk2SiFRewkRnMoIWBxBQMhCHpZmpc2sRhqYjES0u1yafhxfkeYUi0RGHHeiSmoBSPz+lThQOZ4NZGj26jkJksILEBVBakFmNu5FxTwAglQAKIxMkfeUib5SX7mf6q4GgjX5Hbqfa08FKUHmMGm7zC7EWsV4phdHp9AZDaVjWUUr4IJUelWA71giF+px7NT8kxyMEuCvSCM3EUWokkkIvR1yykIcpqMhulTqWlSc5GXusgd7I1qSpGUEOUwFWtRloE4nMZqtjMKxCd7uaPt2QfDv2WYouPkGsHnXXmedYxeN5jhKIO0bjNuZrc93cD4wH7bnMjlkx1iMJYjGkNRgOvc17jvEIE16fpBmGNdPg3DsgW3XsXD3b9Nj9EEtG7Xtyyws5wJUSD6zIB8pWeNpkOdFI0lkBQlFUHJtE1OxZA9KpzHsKxwLndEhRvO5qJiJgbQAITAKBon4R56PbJiMlY7JNA4v0NF+JxtCUDQJz3E1hLNSi4KwJNEObOjn3TFCXQ7PjigkLRgN0oEXLkVlNAKCxiN2eQhwKK8TMjUTyHMyyU0ku0nxlcl7JmZZiiMDTlm-OEpFZWkuzDOZjBc4D6VRdx0X4GgIDgIQRKgl5giUt9iNkeEJxBCs2Oy0EyFWHlAPhMNbFqCjo3uWMoAa1DlhkN1TDOH5HCRTVVjICQ+KKSx6VpZFhtvZdUxfdcHM07Z1i7QrHBccwTAWcxjIaMKoPE-a7IYxB7D2I9bDpGw7GOVlAJkFyxBOEwHCKU85B2u5IoQlMJoc9Z7FkKc3SWYK9Q9byHD85xUQ9dHHChkh4ZmAp-vSPlTxOK7BJc0rXCAA */
  createMachine<MediaPlayerContext>({
    context: {
      atBeginning: true,
      atEnd: false,
    },
    id: 'Media Player',
    initial: 'Stopped',
    states: {
      Stopped: {
        on: {
          Play: {
            cond: notAtEndGuard,
            target: 'Playing',
          },
          Rewind: {
            cond: notAtBeginning,
            target: 'Rewind',
          },
          FastForward: {
            cond: notAtEndGuard,
            target: 'Fast Forward',
          },
        },
      },
      Playing: {
        entry: assign({ atBeginning: false }),
        on: {
          Stop: {
            target: 'Stopped',
          },
          Pause: {
            target: 'Paused',
          },
          Rewind: {
            cond: notAtBeginning,
            target: 'Rewind',
          },
          AtEnd: {
            actions: assign({ atEnd: (context) => true }),
            target: 'Stopped',
          },
          FastForward: {
            cond: notAtEndGuard,
            target: 'Fast Forward',
          },
        },
      },
      Paused: {
        on: {
          Stop: {
            target: 'Stopped',
          },
          Play: {
            cond: notAtEndGuard,
            target: 'Playing',
          },
          Rewind: {
            cond: notAtBeginning,
            target: 'Rewind',
          },
          FastForward: {
            cond: notAtEndGuard,
            target: 'Fast Forward',
          },
        },
      },
      Rewind: {
        entry: assign({ atEnd: false }),
        on: {
          Stop: {
            target: 'Stopped',
          },
          AtBeginning: {
            actions: assign({ atBeginning: (context) => true }),
            target: 'Stopped',
          },
        },
      },
      'Fast Forward': {
        on: {
          Stop: {
            target: 'Stopped',
          },
          AtEnd: {
            target: 'Stopped',
          },
        },
      },
    },
  });
