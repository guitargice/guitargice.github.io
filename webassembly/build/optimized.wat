(module
 (type $none_=>_none (func))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i64_=>_i64 (func (param i64) (result i64)))
 (type $none_=>_f64 (func (result f64)))
 (import "env" "seed" (func $~lib/builtins/seed (result f64)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 1036) ",")
 (data (i32.const 1048) "\01\00\00\00\18\00\00\00~\00l\00i\00b\00/\00m\00a\00t\00h\00.\00t\00s")
 (global $assembly/index/universe_width (mut i32) (i32.const 0))
 (global $assembly/index/universe_height (mut i32) (i32.const 0))
 (global $assembly/index/alive_color (mut i32) (i32.const 0))
 (global $assembly/index/dead_color (mut i32) (i32.const 0))
 (global $assembly/index/chunk_offset (mut i32) (i32.const 0))
 (global $~lib/math/random_seeded (mut i32) (i32.const 0))
 (global $~lib/math/random_state0_64 (mut i64) (i64.const 0))
 (global $~lib/math/random_state1_64 (mut i64) (i64.const 0))
 (global $~lib/math/random_state0_32 (mut i32) (i32.const 0))
 (global $~lib/math/random_state1_32 (mut i32) (i32.const 0))
 (export "init" (func $assembly/index/init))
 (export "update" (func $assembly/index/update))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/math/murmurHash3 (param $0 i64) (result i64)
  local.get $0
  local.get $0
  i64.const 33
  i64.shr_u
  i64.xor
  i64.const -49064778989728563
  i64.mul
  local.tee $0
  local.get $0
  i64.const 33
  i64.shr_u
  i64.xor
  i64.const -4265267296055464877
  i64.mul
  local.tee $0
  local.get $0
  i64.const 33
  i64.shr_u
  i64.xor
 )
 (func $~lib/math/splitMix32 (param $0 i32) (result i32)
  local.get $0
  i32.const 1831565813
  i32.add
  local.tee $0
  local.get $0
  i32.const 15
  i32.shr_u
  i32.xor
  local.get $0
  i32.const 1
  i32.or
  i32.mul
  local.tee $0
  local.get $0
  local.get $0
  i32.const 61
  i32.or
  local.get $0
  local.get $0
  i32.const 7
  i32.shr_u
  i32.xor
  i32.mul
  i32.add
  i32.xor
  local.tee $0
  local.get $0
  i32.const 14
  i32.shr_u
  i32.xor
 )
 (func $~lib/memory/memory.copy (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  local.set $4
  block $~lib/util/memory/memmove|inlined.0
   local.get $0
   i32.eqz
   br_if $~lib/util/memory/memmove|inlined.0
   local.get $0
   if
    local.get $0
    i32.const 7
    i32.and
    i32.eqz
    if
     loop $while-continue|0
      local.get $3
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $4
       i32.const 1
       i32.sub
       local.set $4
       local.get $3
       local.tee $2
       i32.const 1
       i32.add
       local.set $3
       local.get $0
       local.tee $1
       i32.const 1
       i32.add
       local.set $0
       local.get $2
       local.get $1
       i32.load8_u
       i32.store8
       br $while-continue|0
      end
     end
     loop $while-continue|1
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $3
       local.get $0
       i64.load
       i64.store
       local.get $4
       i32.const 8
       i32.sub
       local.set $4
       local.get $3
       i32.const 8
       i32.add
       local.set $3
       local.get $0
       i32.const 8
       i32.add
       local.set $0
       br $while-continue|1
      end
     end
    end
    loop $while-continue|2
     local.get $4
     if
      local.get $3
      local.tee $2
      i32.const 1
      i32.add
      local.set $3
      local.get $0
      local.tee $1
      i32.const 1
      i32.add
      local.set $0
      local.get $2
      local.get $1
      i32.load8_u
      i32.store8
      local.get $4
      i32.const 1
      i32.sub
      local.set $4
      br $while-continue|2
     end
    end
   else
    local.get $0
    i32.const 7
    i32.and
    i32.eqz
    if
     loop $while-continue|3
      local.get $4
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $4
       i32.const 1
       i32.sub
       local.tee $4
       local.get $0
       local.get $4
       i32.add
       i32.load8_u
       i32.store8
       br $while-continue|3
      end
     end
     loop $while-continue|4
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $4
       i32.const 8
       i32.sub
       local.tee $4
       local.get $0
       local.get $4
       i32.add
       i64.load
       i64.store
       br $while-continue|4
      end
     end
    end
    loop $while-continue|5
     local.get $4
     if
      local.get $4
      i32.const 1
      i32.sub
      local.tee $4
      local.get $0
      local.get $4
      i32.add
      i32.load8_u
      i32.store8
      br $while-continue|5
     end
    end
   end
  end
 )
 (func $assembly/index/init (param $0 i32) (param $1 i32)
  (local $2 i64)
  (local $3 i64)
  local.get $0
  global.set $assembly/index/universe_width
  local.get $1
  global.set $assembly/index/universe_height
  i32.const -3958784
  global.set $assembly/index/alive_color
  i32.const -723724
  global.set $assembly/index/dead_color
  local.get $0
  local.get $1
  i32.mul
  i32.const 2
  i32.shl
  global.set $assembly/index/chunk_offset
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   global.get $assembly/index/universe_width
   i32.lt_u
   if
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $assembly/index/universe_height
     i32.lt_u
     if
      global.get $~lib/math/random_seeded
      i32.eqz
      if
       call $~lib/builtins/seed
       i64.reinterpret_f64
       local.set $2
       i32.const 1
       global.set $~lib/math/random_seeded
       local.get $2
       call $~lib/math/murmurHash3
       global.set $~lib/math/random_state0_64
       global.get $~lib/math/random_state0_64
       i64.const -1
       i64.xor
       call $~lib/math/murmurHash3
       global.set $~lib/math/random_state1_64
       local.get $2
       i32.wrap_i64
       call $~lib/math/splitMix32
       global.set $~lib/math/random_state0_32
       global.get $~lib/math/random_state0_32
       call $~lib/math/splitMix32
       global.set $~lib/math/random_state1_32
       global.get $~lib/math/random_state1_32
       i32.const 0
       i32.ne
       i32.const 0
       global.get $~lib/math/random_state0_32
       i32.const 0
       global.get $~lib/math/random_state1_64
       i64.const 0
       i64.ne
       i32.const 0
       global.get $~lib/math/random_state0_64
       i64.const 0
       i64.ne
       select
       select
       select
       i32.eqz
       if
        i32.const 0
        i32.const 1056
        i32.const 1399
        i32.const 5
        call $~lib/builtins/abort
        unreachable
       end
      end
      global.get $~lib/math/random_state0_64
      local.set $3
      global.get $~lib/math/random_state1_64
      local.tee $2
      global.set $~lib/math/random_state0_64
      local.get $2
      local.get $3
      local.get $3
      i64.const 23
      i64.shl
      i64.xor
      local.tee $3
      local.get $3
      i64.const 17
      i64.shr_u
      i64.xor
      i64.xor
      local.get $2
      i64.const 26
      i64.shr_u
      i64.xor
      global.set $~lib/math/random_state1_64
      global.get $assembly/index/chunk_offset
      local.get $0
      local.get $1
      global.get $assembly/index/universe_width
      i32.mul
      i32.add
      i32.const 2
      i32.shl
      i32.add
      global.get $assembly/index/alive_color
      global.get $assembly/index/dead_color
      local.get $2
      i64.const 12
      i64.shr_u
      i64.const 4607182418800017408
      i64.or
      f64.reinterpret_i64
      f64.const 1
      f64.sub
      f64.const 0.5
      f64.gt
      select
      i32.store
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  global.get $assembly/index/chunk_offset
  global.get $assembly/index/chunk_offset
  call $~lib/memory/memory.copy
 )
 (func $assembly/index/countNeighbours (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  i32.const 0
  local.get $1
  i32.const 1
  i32.add
  local.get $1
  global.get $assembly/index/universe_height
  i32.const 1
  i32.sub
  local.tee $4
  i32.eq
  select
  local.set $5
  i32.const 0
  local.get $0
  i32.const 1
  i32.add
  local.get $0
  global.get $assembly/index/universe_width
  i32.const 1
  i32.sub
  local.tee $2
  i32.eq
  select
  local.set $6
  global.get $assembly/index/alive_color
  local.get $0
  i32.const 1
  i32.sub
  local.get $2
  local.get $0
  select
  local.tee $2
  local.get $1
  i32.const 1
  i32.sub
  local.get $4
  local.get $1
  select
  local.tee $4
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $0
  local.get $4
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $6
  local.get $4
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $6
  local.get $1
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $6
  local.get $5
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $0
  local.get $5
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $2
  local.tee $0
  local.get $5
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
  local.tee $3
  i32.const 1
  i32.add
  local.get $3
  global.get $assembly/index/alive_color
  local.get $0
  local.get $1
  global.get $assembly/index/universe_width
  i32.mul
  i32.add
  i32.const 2
  i32.shl
  i32.load
  i32.eq
  select
 )
 (func $assembly/index/update
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $1
   global.get $assembly/index/universe_width
   i32.lt_u
   if
    i32.const 0
    local.set $0
    loop $for-loop|1
     local.get $0
     global.get $assembly/index/universe_height
     i32.lt_u
     if
      local.get $1
      local.get $0
      call $assembly/index/countNeighbours
      local.tee $2
      i32.const 2
      i32.lt_u
      if
       global.get $assembly/index/chunk_offset
       local.get $1
       local.get $0
       global.get $assembly/index/universe_width
       i32.mul
       i32.add
       i32.const 2
       i32.shl
       i32.add
       global.get $assembly/index/dead_color
       i32.store
      else
       local.get $2
       i32.const 3
       i32.eq
       if
        global.get $assembly/index/chunk_offset
        local.get $1
        local.get $0
        global.get $assembly/index/universe_width
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        i32.add
        global.get $assembly/index/alive_color
        i32.store
       else
        local.get $2
        i32.const 3
        i32.gt_u
        if
         global.get $assembly/index/chunk_offset
         local.get $1
         local.get $0
         global.get $assembly/index/universe_width
         i32.mul
         i32.add
         i32.const 2
         i32.shl
         i32.add
         global.get $assembly/index/dead_color
         i32.store
        end
       end
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $assembly/index/chunk_offset
  global.get $assembly/index/chunk_offset
  call $~lib/memory/memory.copy
 )
 (func $~start
  i32.const 1
  memory.grow
  drop
 )
)
