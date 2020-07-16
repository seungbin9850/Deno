# Deno

## Deno?

Node.JS 개발자인 Ryan Dahl이 개발

Node의 단점을 보완한 새로운 런타임

1. node_modules

2. 보안

Node와 같은 V8 엔진을 사용하며

C++ 대신 Rust로 만들어졌고

이벤트 루프로 Tokio를 사용하고

TypeScript를 지원함

Deno의 모든 비동기 작업은 Promise를 반환한다.

Deno는 파일 시스템, 네트워크, 환경 접근에 명시적인 허가가 필요하다.

ES module 시스템을 사용하기 때문에 require()을 사용하지 않는다. (url로 임포트)

## Install in Windows PowerShell
```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

## REPL

deno 입력시 REPL 접속 가능

node와 사용 방법은 같다
```
~/deno> deno
Deno 1.2.0
exit using ctrl+d or close()
> 1 + 2
3
>
```

## Module

기존의 node에선 NPM으로 모듈을 설치하여 사용했다

deno에선 url로 모듈을 불러올 수 있다

``` typescript
import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
```

모든 자바스크립트 API는 Deno 글로벌 네임스페이스 안에 들어있다.

안전하지 않은 기능은 --unstable 플래그를 이용해 사용할 수 있다.