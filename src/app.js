import css from './app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

import $ from 'jquery';
import './jquery.changeStyle';

// 在 html 中应该有 id 为 "hello" 的元素吧，这点相信大家都懂的。
// 这一行作用是把元素的内容改成 "change to other text"
$("#hello").text('change to other text');
$("#hello").changeStyle('pink');

console.log('Hello World1');
console.log('Hello World2');
console.log('Hello World3');

ReactDOM.render(
    <Root></Root>,
    document.getElementById('root')
);