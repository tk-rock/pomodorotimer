# ポモドーロタイマー

シンプルで使いやすいポモドーロタイマーアプリケーションです。作業と休憩のサイクルを管理し、生産性を向上させます。

## 機能

- 作業時間、短い休憩時間、長い休憩時間のカスタマイズ
- 長い休憩までのサイクル数の設定
- 視覚的なタイマー表示（円形プログレスバー付き）
- ブラウザ通知機能
- サウンド通知機能
- レスポンシブデザイン（モバイル対応）

## 使い方

1. `index.html` ファイルをブラウザで開きます
2. 必要に応じて設定を調整します:
   - 作業時間（デフォルト: 25分）
   - 休憩時間（デフォルト: 5分）
   - 長い休憩時間（デフォルト: 15分）
   - 長い休憩までのサイクル数（デフォルト: 4）
3. 再生ボタンをクリックしてタイマーを開始します
4. タイマーが終了すると、自動的に次のモード（作業/休憩）に切り替わります
5. いつでもリセットボタンを押してタイマーをリセットできます

## 技術仕様

- HTML5
- CSS3
- JavaScript (ES6+)
- ブラウザ通知 API
- Font Awesome アイコン

## 注意事項

- ブラウザ通知を使用するには、最初の通知リクエストを許可する必要があります
- 一部のブラウザでは、タブがアクティブでない場合、タイマーの精度が低下する可能性があります
