type TProps = {
    a: string
    b: number
}


function Foo(){
    return 'Foo'
}

export function Bar({a, }:TProps){
    return 'Bar'
}

export function Baz(){
    return 'Baz'
}