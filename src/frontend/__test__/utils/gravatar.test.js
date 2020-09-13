import gravatar from '../../utils/gravatar';

test('Gravatar Functio test', () => {
  const email = 'hecto932@gmail.com';
  const gravatarUrl =
    'https://gravatar.com/avatar/c7fbfbcf4ded30f0cd55029f7c43205d';
  expect(gravatarUrl).toEqual(gravatar(email));
});
