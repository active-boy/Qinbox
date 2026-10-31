# QinBox 角色提示词

本目录包含可直接作为聊天模型 `system` 消息使用的角色提示词。建议程序每次请求时按顺序拼接：`shared_rules.txt` + 对应角色文件 + 当前存档摘要 + 该角色近期聊天记录。不要把其他角色的私聊原文直接塞进上下文；仅注入游戏系统明确解锁的共享记忆。

## 文件

- `shared_rules.txt`：全局叙事规则、时代基调、魇胜师设定和安全边界。
- `ying-zheng.txt`、`zhao-gao.txt`、`lao-ai.txt`、`fusu.txt`、`hu-hai.txt`、`empress-dowager-zhao.txt`、`lu-buwei.txt`、`liu-bang.txt`、`xiang-yu.txt`、`li-si.txt`、`meng-tian.txt`、`yansheng-player.txt`：角色专属提示词。最后一份是玩家身份设定参考，不是聊天对象提示词。

## 注入动态信息

可以在角色提示词之后附上这些由游戏状态提供的内容：

```text
【当前时间与地点】……
【玩家称呼与已建立关系】……
【本角色已知的共享记忆】……
【本角色已收到的物品】……
【本轮可触发的剧情线索】……
```

没有数据时省略对应区块，不要让模型自行补造状态。
