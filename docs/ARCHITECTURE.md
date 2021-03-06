# プログラム構成

## クラス・関数

### Commandクラス
oclifで用意されているコマンドのエントリポイント

ファイルパスやフラグなどを受け取るだけに留める

具体的な処理は、後述の commandHandler関数 に移譲している

#### このクラスでの処理の流れ
1. ターミナルで入力された、ファイルパス・フラグを取得
2. commandHandler関数に 1 で取得したファイルパス等を渡して処理を委譲
3. commandHandler関数の戻り値を利用して、ターミナルに結果を表示

### commandHandler関数
具体的な処理を行う関数

コマンドと1:1で対応する形で作成

この関数では、ファイルの出力やターミナルへの出力などの操作は行わない

### common
#### readLogFile関数
ログファイルを後述のLogsモデルに変換する関数

Logクラスにパースできない行は無視する形で変換を行う

### 各種モデル

#### Logクラス
ログファイル内の1行分をモデル化したクラス

#### Logsクラス
Logクラスを要素とする配列の拡張クラス

このプログラムに特徴的な関数が複数含まれる (グルーピングなど)

#### Periodクラス
期間をモデル化したクラス

このプログラムでは実質、Dateクラスのフォーマッターとして利用している

#### IPv4クラス
プレフィックス付きのIPv4アドレスをモデル化したクラス

アドレス同士の比較や、サブネットの算出などを行う

##### IPv4Subnetクラス
IPv4クラスを継承したクラス

toString関数を書き換えることでサブネットでの比較が可能となっている

また、このクラスを利用することで、設問2と設問4の処理の殆どを同一のもので行うことができている
