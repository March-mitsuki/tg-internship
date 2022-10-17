## how to use
* root dirの中に.envファイルと作り、中に`BEARER_TOKEN`というkeyを定義してください
```
# .env file
BEARER_TOKEN=your_scret_key
```

* 直接CLIでコマンドを実行します
```bash
# use set-rules to set rules
node cmd.js set-rules --value="value1 value2" --tag="description here"

# use set-keyword-rules to set keyword rules 
node cmd.js set-keyword-rules --keyword="word1 word2" --tag="description" --lang=ja

# use get-rules to get all rules
node cmd.js get-rules

# use del-rules to delete all rules
node cmd.js del-rules

# use conn-stream to monitor stream
node cmd.js conn-stream

#use conn-stream to fmt monitor stream
node cmd.js fmt-keyword-stream
```