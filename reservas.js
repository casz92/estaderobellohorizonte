import { gettoken, settoken, getallRooms, getavailableRooms, getprompt, putprompt, generateprompt } from 'backend/test.web';

$w.onReady(async function () {

   // console.log(await multiply(4,5));
   // settoken('asd', 'test of test');
   // console.log(await gettoken('asd'));
   // console.log(await getallRooms());
   // console.log(await getavailableRooms("1759968000000", "1760054400000"));

   // console.log(await getprompt());
   // console.log(await putprompt("111111111111111111111111111111111111111111111111112222"));
   // console.log(await generateprompt());

   generateprompt().then(text => {
      // console.log(text);
      if (text.length > 0) putprompt(text);
    });
});