// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDOjArna-lFSjmi3vChkLRiT4eyJ7dq5gw',
    authDomain: 'sparta-4305e.firebaseapp.com',
    projectId: 'sparta-4305e',
    storageBucket: 'sparta-4305e.appspot.com',
    messagingSenderId: '187319515346',
    appId: '1:187319515346:web:a0313e0f75ff30567a950b',
    measurementId: 'G-10L9XTK90Z',
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(window.location.pathname);

if (window.location.pathname === '/index.html') {
    getGuestBooks();
} else if (window.location.pathname === '/personalPage_main.html') {
    getMemberData('LeeHayan');
}

// else if (window.location.pathname === '/personalPage_boyoung.html') {
//     getMemberData('LeeBoyoung');
// } else if (window.location.pathname === '/personalPage_hayan.html') {
//     getMemberData('LeeHayan');
// } else if (window.location.pathname === '/personalPage_jihun.html') {
//     getMemberData('SonJihun');
// } else if (window.location.pathname === '/personalPage_jiyoung.html') {
//     getMemberData('BangJiYoung');
// } else if (window.location.pathname === '/personalPage_seyoung.html') {
//     getMemberData('LeeSeyoung');
// } else if (window.location.pathname === '/personalPage_yunju.html') {
//     getMemberData('KangYunju');
//}

async function getGuestBooks() {
    console.log('게스트북');
    $('.submit').click(async function () {
        let inputName = $('.yourname').val();
        let inputContent = $('.yourcontent').val();
        let boxName = $('.boxname').val();
        let boxContent = $('.boxcontent').val();
        let doc = {
            name: inputName,
            content: inputContent,
        };
        await addDoc(collection(db, 'review'), doc);
        alert('등록되었습니다.');
        window.location.reload();
    });
    let docs = await getDocs(collection(db, 'review'));
    docs.forEach((document) => {
        let row = document.data();
        let thisname = row['name'];
        let thiscontent = row['content'];
        let temp_html = `
              <div id=${document.id} class="box">
                  <button class="delete">x</button>
                  <div class="boxinner">
                      <div class="boxname">${thisname}</div>
                      <div class="boxcontent">${thiscontent}</div>
                  </div>
              </div>`;
        $('.resultbox').append(temp_html);
        $(`#${document.id} .delete`).click(async function (e) {
            if (confirm('삭제하시겠습니까?')) {
                e.target.parentElement.remove();
                if (e.target.parentElement.id === document.id) {
                    await deleteDoc(doc(db, 'review', document.id));
                }
            } else {
            }
        });
    });
}

// 멤버 정보 가져오기

const $name = document.querySelector('.profile_name > h1');
const $word = document.querySelector('.profile_short > h1');
const $blog = document.querySelector('.blog_image > a');
const $git = document.querySelector('.github_image > a');
const $profileImg = document.querySelector('.profile_photo > img');
const $mbtiImg = document.querySelector('.mbtiImg > img');
const $teamPlayImg = document.querySelector('.teamPlayImg> img');
const $strengthImg = document.querySelector('.strengthImg> img');
const $hobbyImg = document.querySelector('.hobbyImg> img');
const $title = document.querySelector('.explain_body > .title');
const $comment = document.querySelector('.explain_body > .comment');
console.log($title);

const globalObj = {};

async function getMemberData(id) {
    const personalDoc = await getDoc(doc(db, 'members', id));
    // console.log(memberDocRef.data());
    const { blog, color, git, hobby, mbti, name, profileImg, strength, teamPlay, word } =
        personalDoc.data(); //

    // 전역객체에 넣음 (이럼안되는데 ㅠ)
    globalObj.mbti = mbti;
    globalObj.hobby = hobby;
    globalObj.strength = strength;
    globalObj.teamPlay = teamPlay;

    $name.textContent = name;
    $word.textContent = word;
    $blog.href = blog;
    $git.href = git;
    $profileImg.src = profileImg;
    $mbtiImg.src = mbti.mbtiImg;
    $teamPlayImg.src = teamPlay.teamPlayImg;
    $strengthImg.src = strength.strengthImg;
    $hobbyImg.src = hobby.hobbyImg;
}

console.log(globalObj);

function changePersonalInfo(target) {
    const { title, comment } = globalObj[target];
    $title.textContent = title;
    $comment.textContent = comment;

    console.log(title, comment);
}

$mbtiImg.addEventListener('click', () => changePersonalInfo('mbti'));
$teamPlayImg.addEventListener('click', () => changePersonalInfo('teamPlay'));
$strengthImg.addEventListener('click', () => changePersonalInfo('strength'));
$hobbyImg.addEventListener('click', () => changePersonalInfo('hobby'));
