#!/usr/bin/env node

// 测试TTY检测
console.log('=== TTY检测测试 ===');
console.log('stdin.isTTY:', !!process.stdin.isTTY);
console.log('stdout.isTTY:', !!process.stdout.isTTY);
console.log('stderr.isTTY:', !!process.stderr.isTTY);

// 测试/dev/tty是否存在
import fs from 'fs';
console.log('\n=== /dev/tty 测试 ===');
try {
  fs.accessSync('/dev/tty', fs.constants.R_OK);
  console.log('/dev/tty: 可访问');
} catch (err) {
  console.log('/dev/tty: 不可访问 -', err.message);
}

// 测试空参数情况
console.log('\n=== 空参数测试 ===');
import { spawn } from 'child_process';

const testEmptyArgs = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 3000
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

// 测试非TTY环境下的自动降级
const testNonTTY = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 3000
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
  });
};

async function runTests() {
  console.log('运行空参数测试...');
  const emptyResult = await testEmptyArgs();
  console.log('空参数结果:', {
    code: emptyResult.code,
    hasOutput: emptyResult.stdout.length > 0 || emptyResult.stderr.length > 0,
    stdout: emptyResult.stdout.slice(0, 100),
    stderr: emptyResult.stderr.slice(0, 100)
  });
  
  console.log('\n运行非TTY环境测试...');
  const nonTTYResult = await testNonTTY();
  console.log('非TTY结果:', {
    code: nonTTYResult.code,
    hasOutput: nonTTYResult.stdout.length > 0 || nonTTYResult.stderr.length > 0,
    stdout: nonTTYResult.stdout.slice(0, 100),
    stderr: nonTTYResult.stderr.slice(0, 100)
  });
}

runTests().catch(console.error);
