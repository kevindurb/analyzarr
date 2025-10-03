.paths |= with_entries(
  .value |= with_entries(
    if (.key | test("get|post|put|delete|patch|options|head|trace")) then
      .value |= (
        if has("parameters") then
          .parameters |= map(
            if has("schema") and (.schema.default == null) then
              .schema |= del(.default)
            else
              .
            end
          )
        else .
        end
      )
    else .
    end
  )
)
