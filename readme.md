## how to use

* まずはsrcに入ります
```bash
cd src
```

* そしてCLIでコマンドを実行します
```bash
# use set-rules to set rules
node index.js set-rules --value="value1 value2" --tag="description here"

# use get-rules to get all rules
node index.js get-rules

# use del-rules to delete all rules
node index.js del-rules

# use conn-stream to monitor stream
node index.js conn-stream
```