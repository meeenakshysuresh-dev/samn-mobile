import packageJson from '../../package.json';

export const APP_DISPLAY_NAME = 'Someone Around Me Now';
export const APP_SHORT_NAME = 'SAMN';
export const APP_VERSION = packageJson.version;
export const SUPPORT_EMAIL = 'support@samn.app';
export const WEBSITE_URL = 'https://www.samn.app';
export const WEBSITE_LABEL = 'www.samn.app';
export const COPYRIGHT = '© 2026 Someone Around Me Now. All Rights Reserved.';

export const APP_DESCRIPTION =
  'Someone Around Me Now (SAMN) is a community-driven platform that connects people who need help with trusted individuals nearby who are ready to assist. Whether it\'s completing everyday tasks, offering professional services, or lending a helping hand, SAMN makes it easy to discover, connect, and collaborate within your local community. Our mission is to build stronger neighborhoods by providing a safe, reliable, and user-friendly platform where people can request help, offer their skills, and support one another. We are committed to delivering a secure, seamless, and continuously improving experience that brings communities closer together.';

export const APP_MISSION =
  'To build stronger neighborhoods by providing a safe, reliable, and user-friendly platform where people can request help, offer their skills, and support one another — bringing communities closer together every day.';

export const FAQ_ITEMS = [
  {
    question: 'How do I create an account?',
    answer:
      'Tap Sign Up on the login screen, enter your name, email, and password, then verify your email address to activate your SAMN account.',
  },
  {
    question: 'How do I reset my password?',
    answer:
      'On the login screen, tap Forgot Password, enter your registered email, and follow the reset link sent to your inbox.',
  },
  {
    question: 'How do I update my profile?',
    answer:
      'Open the Profile tab, tap the edit icon, update your details, then tap Save to store your changes.',
  },
  {
    question: 'How do I enable notifications?',
    answer:
      'Go to Settings → Preferences and turn on Push Notifications. Allow notification permission when prompted on your device.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Email us at support@samn.app or use Email Support on this screen. We aim to respond within one business day.',
  },
] as const;
