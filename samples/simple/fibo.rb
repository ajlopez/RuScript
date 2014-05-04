def fibo(n)
  puts "n"
  puts n
  
  if n == 0
    puts "zero"
    1
  else
    if n == 1
      puts "one"
      1
    else      puts "other"      n1 = n-1      n2 = n-2
      puts n1
      puts n2      f1 = fibo(n1)      f2 = fibo(n2)      f1 + f2
    end
  end
end

x = 1

while x <= 2
  fibo(x)
  x = x + 1
end