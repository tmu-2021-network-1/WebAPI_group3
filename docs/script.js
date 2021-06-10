let counter = 0;
const sliderlist_item = document.querySelectorAll(".sliderlist__item");
const menuArray = ['コーヒー', '紅茶', '抹茶', 'はちみつ', 'チーズ', 'いちご', 'ドーナツ', 'サンド'];

window.onload = async function () {
  // 検索する
  let search = async () => {
    // 入力された値でを本を検索
    let items = await searchBooks($q, $maxResults, $startIndex);

    items.forEach(item => {
      //説明文がなかったらもう一度検索し直す
      if (String(item.description) == 'undefined') {
        document.getElementById('popInfo').textContent = "(No description)";
        $startIndex = getRandomInt(0, 50);
        search();
      } else {
        document.getElementById('popInfo').textContent = item.description;
      }

      if (item.image == '') {
        //画像がない時の代替画像（レイアウト崩れ防止）
        document.getElementById('popImg').setAttribute('src', './img/noImage.png');
      } else {
        document.getElementById('popImg').setAttribute('src', item.image);
      }

      if (String(item.title) == '') {
        document.getElementById('popTitle').textContent = "(No title)";
      } else {
        document.getElementById('popTitle').textContent = item.title;
      }

      document.getElementById("popLink").href = item.link;

    });
  };

  // 初期値設定
  $q = 'コーヒー';
  $maxResults = 1;
  $startIndex = getRandomInt(0, 50);

  document.getElementById("order-button").onclick = function () {
    //画像スライダーの位置確認
    for (i = 0; i < sliderlist_item.length; i++) {
      if (i == counter) {
        $q = menuArray[i];
      }
    }
    $startIndex = getRandomInt(0, 50);
    search();
  };

};
// 本を検索して結果を返す
let searchBooks = async (query) => {
  // Google Books APIs のエンドポイント
  let endpoint = 'https://www.googleapis.com/books/v1';

  // 検索 API を叩く
  let res = await fetch(`${endpoint}/volumes?q=${$q}&maxResults=${$maxResults}&startIndex=${$startIndex}`);
  // JSON に変換
  let data = await res.json();

  // 必要なものだけ抜き出してわかりやすいフォーマットに変更する
  let items = data.items.map(item => {
    let vi = item.volumeInfo;
    console.log(vi.description);
    return {
      title: vi.title,
      description: vi.description,
      image: vi.imageLinks ? vi.imageLinks.thumbnail : '',
      link: vi.infoLink,
    };
  });

  return items;
};

//ポップアップ
function popupImage() {
  let popup = document.getElementById('js-popup');
  let popupWord = document.getElementById('js-popup-word');
  let popup2 = document.getElementById('js-popup-after');
  if (!popup) return;

  let blackBg = document.getElementById('js-black-bg');
  let closeBtn = document.getElementById('js-close-btn');
  let showBtn = document.getElementById('order-button');

  closePopUp(blackBg);
  closePopUp(closeBtn);
  closePopUp(showBtn);
  function closePopUp(elem) {
    if (!elem) return;
    elem.addEventListener('click', function () {

      if (popup.classList.contains('is-show') == false) {
        popup.classList.toggle('is-show');
        popupWord.classList.add('is-show');

        //ローディングアニメーションもどき
        window.setTimeout(first, 1000);
        function first() {
          popupWord.textContent = "finding the best book for you .";
        }
        window.setTimeout(second, 2000);
        function second() {
          popupWord.textContent = "finding the best book for you ..";
        }
        window.setTimeout(third, 3000);
        function third() {
          popupWord.textContent = "finding the best book for you ...";
        }

        //時間差で本を表示
        window.setTimeout(dispMsg, 3500);
        function dispMsg() {
          popupWord.classList.remove('is-show');
          popupWord.textContent = "finding the best book for you";
          popup2.classList.toggle('is-show');

        }
      } else {
        popup.classList.toggle('is-show');
        popup2.classList.toggle('is-show');
      }
    });
  }
}
popupImage();

//ランダムに本を選択
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

//画像スライダー
const slider = function () {
  // Next(Prev)ボタンの取得
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  // liタグのwidthを取得
  const sliderwidth = document.querySelector(".sliderlist__item");
  let width = sliderwidth.clientWidth;

  // slider(ul要素、li要素一覧)の取得
  const sliderlist = document.querySelector(".sliderlist");

  // イベントリスナー (next)
  next.addEventListener("click", function () {
    if (counter == sliderlist_item.length - 1) return; //ボタン連打対策
    prev.style.display = "block";
    sliderlist.style.transition = ".3s";
    counter++;
    sliderlist.style.transform = "translateX(" + (- width * counter) + "px)";

    sliderlist.addEventListener("transitionend", function () {
      if (counter == sliderlist_item.length - 1) {
        sliderlist.style.transition = "none";
        next.style.display = "none";
      }
    })
  });

  // イベントリスナー (prev)
  prev.addEventListener("click", function () {
    if (counter == sliderlist_item.length - sliderlist_item.length) return; //ボタン連打対策
    next.style.display = "block";
    sliderlist.style.transition = ".3s";
    counter--;
    sliderlist.style.transform = "translateX(" + (- width * counter) + "px)";

    sliderlist.addEventListener("transitionend", function () {
      if (counter == sliderlist_item.length - sliderlist_item.length) {
        sliderlist.style.transition = "none";
        prev.style.display = "none";
      }
    })
  });
};

slider();



