#!/usr/bin/env node

import { spawn } from 'child_process';

// 测试非TTY环境下的错误提示
console.log('=== 测试非TTY环境下的行为 ===');

const testNonTTYWithNoInput = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
};

const testNonTTYWithStdin = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // 模拟stdin输入
    child.stdin.write('Hello, world!\n');
    child.stdin.end();
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
};

const testWithPrintFlag = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs', '-p', 'test prompt'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
};

async function runTests() {
  console.log('1. 测试非TTY环境无输入...');
  const result1 = await testNonTTYWithNoInput();
  console.log('结果:', {
    code: result1.code,
    stdout: result1.stdout.slice(0, 200),
    stderr: result1.stderr.slice(0, 200)
  });
  
  console.log('\n2. 测试非TTY环境有stdin输入...');
  const result2 = await testNonTTYWithStdin();
  console.log('结果:', {
    code: result2.code,
    stdout: result2.stdout.slice(0, 200),
    stderr: result2.stderr.slice(0, 200)
  });
  
  console.log('\n3. 测试使用 -p 标志...');
  const result3 = await testWithPrintFlag();
  console.log('结果:', {
    code: result3.code,
    stdout: result3.stdout.slice(0, 200),
    stderr: result3.stderr.slice(0, 200)
  });
}

runTests().catch(console.error);
