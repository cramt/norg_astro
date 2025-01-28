use neon::prelude::*;
use norg_to_html::build_html;

fn build(mut cx: FunctionContext) -> JsResult<JsString> {
    let x = cx.argument::<JsString>(0)?;
    let str = x.value(&mut cx);
    let result = build_html(str.as_str());
    Ok(cx.string(serde_json::to_string(&result).unwrap()))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("build", build)?;
    Ok(())
}
