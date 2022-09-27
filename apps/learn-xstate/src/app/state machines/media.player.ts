import { assign, createMachine } from 'xstate';

export interface MediaPlayerContext {
  atEnd: boolean;
  atBeginning: boolean;
}

const notAtEndGuard = (context: MediaPlayerContext) => !context.atEnd;
const notAtBeginning = (context: MediaPlayerContext) => !context.atBeginning;

export const mediaPlayerStateMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFlIEsCGACACgGwwE8wAnAOgGUAXAewAc7IBifIxUOm2NKtGgO3YgAHogCcAFgDsZMQFY5UiQoBsAJjkqJagDQhCiFQAYAjGQDMEiSalGpKuWJNqJAX1d7UETLgLFy1PSMEEwASmAA7mj8EEKc3LwCQqIIJkZyEmQq5lJqaqZi5k6FegYI0mQAHGKVGkUSYtnpbh4gXj6s-pS0DMwAYhiwVH00JBEYJLFIIPE8fILTKc6VZmJ2auYqlZVSJtYqpYjKRhYquYrmm0UqJu6e6NidpGSd0VBMgXRxXHNJi4iKOQWTQmSoSWppSoZQ7lPYWMHyKSVLRnNRSO5tB6+IjPV78d44DAAV1gYG+CXmyUQaJOEiM5iM1SMZ0hun0iAZZhpK2sRjEUjEYg2GPajz8uL8bzCkWiUw4P0SC1AKUBwJuYIhjOh7IQGhO6jkJksaRqjLUIqxT3IePeAEEqABRGLk35KkQAqRA8wgjVqSHasoSdSnOkZJSM8xQi3eMU462S-FMAZDEZjCZymYKyn-BCq73q8F+rUSGFOE5qIUmORQlzV6TRjri63E0khT4uxVU1K1MielTqOkC4z9mECk6VIxqG5GRkOUyVBuxrqEknMTod7PKxCgtS9zQDuyNZkHHWWMRkFyCk1QxqG8yL7HLlvMcJRZ3TWadnM7vf9lyH4cTzKRoyCrEw9knBlpHyc1WlFR9cWfEJk2GUZxkmDc-i3btdz7A8h2PGE0i0Xt+yrf8inyFQHytMhX1lD4ekwt0UkkGR5EUZRNA0LQ2TKfJ2O9GwpByLRtEZGimzomUYiYe0ACEwCgaJ+DeZiuzY2QFCUVQeO0GENCBJxtCUDQp0PWD7hjBDyBQrBU3QtsmI-LMsPdVIcnPIM6QrPZaiDOQYU0SoLHI455GZSp7zgy0pLshz0zkx133lCk3KWKwQuZKQBShM5wTkPjqX7C8qOZcCHEK6iMX4GgIDgIR4Noz5gnU79wN3fkdmcSRrmcGE6RCyNjjkekg1sW4Yus2ibTa7DNhkT1TCKQFHGRAztjICQcmqSwoOZINJLjF4kLm9z9J1PZdyDdIhW2kw1nMSzMWmqT6JSzM0pYwxNCqao8nAo1vW9Ii0i2kT5EolR+RMaGjq6eK0PTM6MvsWQZ09DYoqBwKdU0L0OrRb1scceHSBR7dKhhABaFwyHWftORyyNcncdwgA */
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
        entry: assign({ atBeginning: false }),
        on: {
          Stop: {
            target: 'Stopped',
          },
          AtEnd: {
            actions: assign({ atEnd: (context) => true }),
            target: 'Stopped',
          },
        },
      },
    },
  });
